/**
 * Rism ベータ：テスター番号を決めて、申し込んだ人にメールで送るスクリプト（Google Apps Script）
 *
 * 使い方（くわしくは beta_recruit_draft.md の 5 章）
 * 1. プロジェクト用の Gmail（rism.app.68j@gmail.com）で、申し込みフォームを作る
 * 2. フォームの「回答」→「スプレッドシートにリンク」で、回答の表を作る
 * 3. 表の「拡張機能」→「Apps Script」を開き、このファイルの中身を全部貼って保存する
 * 4. 下の「設定」の PRE_FORM_URL に、「使う前」のフォームの URL を入れる
 * 5. 関数「preview」を実行して、ログ（実行ログ）で送る内容を確かめる（まだ送らない）
 * 6. 関数「sendNumbers」を実行して送る。送った行には「送信日時」が入り、2 回目は送らない
 *
 * このファイルには、テスターの情報は入っていない（回答の表の中にだけある）。
 */

// ===== 設定 =====
const PRE_FORM_URL = 'ここに「使う前」のフォームの URL を入れる';
const FIRST_NUMBER = 101; // 最初のテスター番号（3 桁）
const SENDER_NAME = 'Rism プロジェクト';
const CONTACT = 'rism.app.68j@gmail.com';
const PRE_START = '2026-11-23'; // 「使う前」の記録の最初の日
const PRE_END = '2026-11-29';   // 「使う前」の記録の最後の日

// 回答の表の見出し（フォームの質問の文に、この言葉が含まれている列を探す）
const COL_EMAIL = '連絡用のメールアドレス';
const COL_PHONE = '使っているスマホ';
const COL_ANDROID_EMAIL = 'Google アカウント';
// スクリプトが足す列
const COL_NUMBER = 'テスター番号';
const COL_SENT = '送信日時';
const COL_NOTE = 'メモ（スクリプト）';

// ===== 本体 =====

/** 送る内容を確かめるだけ（送らない）。番号もまだ書き込まない。 */
function preview() {
  run_(false);
}

/** 番号を書き込み、まだ送っていない人にメールを送る。 */
function sendNumbers() {
  if (PRE_FORM_URL.indexOf('http') !== 0) {
    throw new Error('PRE_FORM_URL に「使う前」のフォームの URL を入れてから実行してください');
  }
  run_(true);
}

function run_(send) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const cols = findColumns_(sheet);
  const values = sheet.getDataRange().getValues();
  const seen = {};
  let next = nextNumber_(values, cols.number);
  let count = 0;

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const email = String(row[cols.email] || '').trim().toLowerCase();
    const sent = row[cols.sent];
    if (!email) continue;

    if (seen[email]) {
      if (send && !sent) sheet.getRange(r + 1, cols.note + 1).setValue('同じアドレスの申し込みがほかの行にあるので送らない');
      Logger.log('（重複のため送らない）%s 行目：%s', r + 1, email);
      continue;
    }
    seen[email] = true;
    if (sent) continue;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (send) sheet.getRange(r + 1, cols.note + 1).setValue('メールアドレスの形が正しくないので送らない');
      Logger.log('（アドレスの形が正しくないため送らない）%s 行目：%s', r + 1, email);
      continue;
    }

    let number = row[cols.number];
    if (!number) {
      number = next++;
      if (send) sheet.getRange(r + 1, cols.number + 1).setValue(number);
    }

    const isAndroid = String(row[cols.phone] || '').indexOf('Android') !== -1;
    const mail = buildMail_(email, number, isAndroid);

    if (send) {
      if (MailApp.getRemainingDailyQuota() < 1) {
        Logger.log('今日送れる数の上限に達しました。明日もう一度 sendNumbers を実行してください。');
        break;
      }
      MailApp.sendEmail(mail);
      sheet.getRange(r + 1, cols.sent + 1)
        .setValue(Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd HH:mm'));
    }
    Logger.log('--- %s 行目（%s）---\n宛先：%s\n件名：%s\n\n%s', r + 1, send ? '送信' : '確認のみ', mail.to, mail.subject, mail.body);
    count++;
  }
  Logger.log('%s：%s 人', send ? '送った人数' : '送る予定の人数', count);
}

function buildMail_(email, number, isAndroid) {
  const install = isAndroid
    ? '・Android の方：アプリの招待のメールが届きます。入れるときに、スマホの設定を 1 つ変える必要があります（手順は改めてお送りします）。'
    : '・iPhone の方：App Store で「TestFlight」というアプリを入れておいてください。';
  const body = [
    'Rism のテスターに申し込んでくださって、ありがとうございます。',
    '',
    'あなたのテスター番号は「' + number + '」です。',
    'このあと、フォームとアプリに入れてもらう番号なので、控えておいてください。',
    '',
    '■ お願い：' + toJa_(PRE_START) + ' から ' + toJa_(PRE_END) + ' までの毎朝',
    '次のフォームで、寝た時刻・起きた時刻・目覚めを記録してください（1 分ほど）。',
    PRE_FORM_URL,
    '',
    '■ アプリの入れ方は、11/29 ごろに改めてお送りします',
    install,
    '',
    'わからないことがあれば、このメールに返信してください。',
    '',
    SENDER_NAME,
    CONTACT,
  ].join('\n');
  return {
    to: email,
    subject: '【Rism】テスター番号と、「使う前」の記録のお願い',
    body: body,
    name: SENDER_NAME,
  };
}

/** 「使う前」の期間の毎朝の思い出しメール（任意）。全員に BCC で 1 通送る。 */
function sendReminder() {
  const today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
  if (today < PRE_START || today > PRE_END) return;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const cols = findColumns_(sheet);
  const values = sheet.getDataRange().getValues();
  const list = [];
  for (let r = 1; r < values.length; r++) {
    const email = String(values[r][cols.email] || '').trim().toLowerCase();
    if (email && values[r][cols.sent] && list.indexOf(email) === -1) list.push(email);
  }
  if (list.length === 0) return;
  MailApp.sendEmail({
    to: CONTACT,
    bcc: list.join(','),
    subject: '【Rism】今朝の記録をお願いします',
    body: [
      'おはようございます。今朝の「寝た時刻・起きた時刻・目覚め」の記録をお願いします（1 分ほど）。',
      PRE_FORM_URL,
      '',
      'テスター番号を忘れた方は、このメールに返信してください。',
      '',
      SENDER_NAME,
    ].join('\n'),
    name: SENDER_NAME,
  });
}

/** 思い出しメールを毎朝 7 時台に送るように設定する（1 回だけ実行）。 */
function setupReminder() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendReminder') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendReminder').timeBased().everyDays(1).atHour(7).inTimezone('Asia/Tokyo').create();
}

/** 思い出しメールの設定を消す（「使う前」の期間が終わったら実行）。 */
function stopReminder() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'sendReminder') ScriptApp.deleteTrigger(t);
  });
}

// ===== 下回り =====

function findColumns_(sheet) {
  let header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const find = function (word) {
    for (let c = 0; c < header.length; c++) if (String(header[c]).indexOf(word) !== -1) return c;
    return -1;
  };
  [COL_NUMBER, COL_SENT, COL_NOTE].forEach(function (name) {
    if (find(name) === -1) {
      sheet.getRange(1, header.length + 1).setValue(name);
      header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  });
  const cols = {
    email: find(COL_EMAIL),
    phone: find(COL_PHONE),
    androidEmail: find(COL_ANDROID_EMAIL),
    number: find(COL_NUMBER),
    sent: find(COL_SENT),
    note: find(COL_NOTE),
  };
  if (cols.email === -1 || cols.phone === -1) {
    throw new Error('回答の表に「' + COL_EMAIL + '」か「' + COL_PHONE + '」を含む見出しが見つかりません。フォームの質問の文を確かめてください');
  }
  return cols;
}

function nextNumber_(values, numberCol) {
  let max = FIRST_NUMBER - 1;
  for (let r = 1; r < values.length; r++) {
    const n = Number(values[r][numberCol]);
    if (n > max) max = n;
  }
  return max + 1;
}

function toJa_(ymd) {
  const p = ymd.split('-');
  return Number(p[1]) + '/' + Number(p[2]);
}

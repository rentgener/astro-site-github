const fieldLabels = {
  fio: "ФИО",
  birth_date: "Дата рождения",
  birth_time: "Время рождения",
  birth_place: "Место рождения",
  contact: "Контакт",
  situation: "Ситуация/вопрос",
  duration: "Как давно беспокоит",
  already_tried: "Что предпринимали",
  diagnoses: "Диагнозы",
  symptom_onset: "Начало симптома",
  object_type: "Тип объекта",
  object_problem: "Проблема объекта",
  object_address: "Адрес объекта",
  family_members: "Члены семьи",
  family_history: "История семьи",
  family_tree: "Родовое древо"
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ error: "BOT_TOKEN или CHAT_ID не настроены" });
    }

    const data = req.body || {};

    const lines = ["Новая заявка с сайта:"];
    for (const key in fieldLabels) {
      const value = data[key];
      if (value && String(value).trim() !== "") {
        lines.push(fieldLabels[key] + ": " + value);
      }
    }
    const text = lines.join("\n");

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      }
    );

    const result = await telegramRes.json();

    if (result.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Telegram API error", details: result });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

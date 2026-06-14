import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EVENT_DATE = new Date("2026-06-27T18:00:00");

const program = [
  "Вручение аттестатов",
  "Фотосессия",
  "Банкет",
  "Салют",
];

const locationName = "Нововасюганский центр культуры";
const locationAddress = "Геологический переулок 8";
const locationCity = "с. Новый Васюган";
const locationTime = "18:00";
const recipientEmail = "asmarinadiana19@gmail.com";

function getCountdown(targetDate: Date): Countdown {
  const now = Date.now();
  const distance = Math.max(targetDate.getTime() - now, 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export default function App() {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(EVENT_DATE));
  const [attendance, setAttendance] = useState("yes");
  const [fullName, setFullName] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(EVENT_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const countdownCells = useMemo(
    () => [
      { label: "дней", value: countdown.days },
      { label: "часов", value: countdown.hours },
      { label: "минут", value: countdown.minutes },
      { label: "секунд", value: countdown.seconds },
    ],
    [countdown],
  );

  function handleScrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleOpenMap() {
    if (locationAddress.startsWith("[")) {
      setSubmitMessage("Добавьте адрес площадки, чтобы открыть карту.");
      return;
    }

    const query = encodeURIComponent(`${locationName} ${locationAddress}`);
    window.open(`https://yandex.ru/maps/?text=${query}`, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      setSubmitMessage("Пожалуйста, укажите имя и фамилию.");
      return;
    }

    setSubmitMessage("");
    setIsSubmitting(true);

    const message = `${fullName.trim()} - ${attendance === "yes" ? "приду" : "не смогу прийти"}`;
    const subject = encodeURIComponent("Ответ на приглашение");
    const body = encodeURIComponent(`Сообщение: ${message}`);
    const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    setSubmitMessage("Открыто приложение почты. Отправьте письмо одной кнопкой.");
    setFullName("");
    setAttendance("yes");
    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-hidden px-5 pb-16 pt-8 sm:px-6">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_12%,rgba(198,162,95,0.17),transparent_40%),radial-gradient(circle_at_85%_4%,rgba(235,227,210,0.9),transparent_34%),linear-gradient(180deg,#fdfbf8_0%,#f9f4ea_100%)]" />
        <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-56 w-56 rounded-full border border-[var(--gold-soft)]/50" />
        <div className="pointer-events-none absolute -right-20 top-96 -z-10 h-48 w-48 rounded-full border border-[var(--gold-soft)]/30" />

        <header className="fade-up mb-8 text-center" style={{ animationDelay: "120ms" }}>
          <p className="font-serif text-sm uppercase tracking-[0.3em] text-[var(--gold-deep)]">Приглашение</p>
          <div className="gold-line mx-auto mt-3 h-px w-28" />
        </header>

        <section className="fade-up card-shell relative mb-4 overflow-hidden px-6 pb-10 pt-8" style={{ animationDelay: "220ms" }}>
          <div className="soft-brush absolute -right-10 -top-8 h-28 w-28" />
          <p className="font-script text-5xl text-[var(--gold-deep)]">Выпускной 2026</p>
          <p className="mt-2 font-serif text-xl text-[var(--ink)]">Дорогие учителя, родители и одноклассники!</p>
          <p className="mt-5 max-w-[28ch] text-sm leading-relaxed text-[var(--ink-muted)]">
            Мы приглашаем вас на наш выпускной! В этом году нас совсем немного, и для нас нет ничего ценнее, чем собраться всем
            вместе, - пожалуйста, не пропустите этот вечер, мы хотим видеть каждого из вас!
          </p>
          <div className="mt-7 flex items-end justify-between border-t border-[var(--gold-soft)]/65 pt-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--ink-muted)]">Дата</p>
              <p className="mt-1 text-lg font-medium">27 июня</p>
            </div>
            <button
              type="button"
              onClick={handleScrollToForm}
              className="shimmer-gold rounded-full border border-[var(--gold-deep)]/35 px-5 py-2.5 text-xs uppercase tracking-[0.17em] text-[var(--gold-deep)] transition hover:scale-[1.02]"
            >
              Подтвердить присутствие
            </button>
          </div>
        </section>

        <section className="fade-up card-shell mb-4 overflow-hidden" style={{ animationDelay: "280ms" }}>
          <img
            src="/images/graduation-luxury.jpg"
            alt="Атмосфера выпускного вечера"
            className="h-[18.5rem] w-full object-cover"
          />
        </section>

        <section className="fade-up card-shell mb-4 px-6 py-7" style={{ animationDelay: "320ms" }}>
          <p className="section-kicker">О событии</p>
          <h2 className="section-title">Торжественный вечер прощания со школой</h2>
          <p className="section-copy">
            Встречаемся, чтобы от души повеселиться. Школа - это круто, а что будет дальше - еще круче. Пусть этот вечер запомнится
            улыбками, танцами и теплыми объятиями.
          </p>
        </section>

        <section className="fade-up card-shell mb-4 px-6 py-7" style={{ animationDelay: "400ms" }}>
          <p className="section-kicker">Программа вечера</p>
          <ul className="mt-4 space-y-3">
            {program.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[var(--ink)]">
                <span className="h-px w-7 bg-[var(--gold-deep)]/70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="fade-up card-shell mb-4 px-6 py-7" style={{ animationDelay: "480ms" }}>
          <p className="section-kicker">Локация</p>
          <h2 className="section-title">{locationName}</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">{locationAddress}</p>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleOpenMap}
              className="shimmer-gold flex-1 rounded-full border border-[var(--gold-deep)]/35 px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-[var(--gold-deep)]"
            >
              Открыть карту
            </button>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-[var(--gold-soft)]/70 pt-4 text-xs text-[var(--ink-muted)]">
            <div>
              <p className="uppercase tracking-[0.12em]">Город</p>
              <p className="mt-1 text-sm text-[var(--ink)]">{locationCity}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.12em]">Время</p>
              <p className="mt-1 text-sm text-[var(--ink)]">{locationTime}</p>
            </div>
            <div>
              <p className="uppercase tracking-[0.12em]">Дата</p>
              <p className="mt-1 text-sm text-[var(--ink)]">27 июня</p>
            </div>
          </div>
        </section>

        <section ref={formRef} className="fade-up card-shell mb-4 px-6 py-7" style={{ animationDelay: "560ms" }}>
          <p className="section-kicker">Анкета гостя</p>
          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            <div>
              <p className="mb-2 text-sm text-[var(--ink-muted)]">Подтверждение присутствия</p>
              <div className="flex gap-2">
                {[
                  { label: "Приду", value: "yes" },
                  { label: "Не смогу прийти", value: "no" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAttendance(option.value)}
                    className={`rounded-full border px-3 py-2 text-xs tracking-wide transition ${
                      attendance === option.value
                        ? "border-[var(--gold-deep)] bg-[var(--gold-soft)]/30 text-[var(--gold-deep)]"
                        : "border-[var(--gold-soft)] text-[var(--ink-muted)]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm text-[var(--ink-muted)]">Имя и фамилия</span>
              <input
                type="text"
                placeholder="Введите ваше имя"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-xl border border-[var(--gold-soft)] bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-[var(--ink-muted)]/70 focus:border-[var(--gold-deep)]"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="shimmer-gold w-full rounded-full border border-[var(--gold-deep)]/40 px-4 py-3 text-xs uppercase tracking-[0.17em] text-[var(--gold-deep)]"
            >
              {isSubmitting ? "Отправляем..." : "Отправить анкету"}
            </button>

            {submitMessage ? <p className="text-sm text-[var(--ink-muted)]">{submitMessage}</p> : null}
          </form>
        </section>

        <section className="fade-up card-shell px-6 py-7" style={{ animationDelay: "640ms" }}>
          <p className="section-kicker">Обратный отсчет</p>
          <h2 className="section-title">До начала вечера</h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {countdownCells.map((cell) => (
              <div key={cell.label} className="rounded-xl border border-[var(--gold-soft)] bg-white/75 px-2 py-3 text-center">
                <p className="text-lg font-medium text-[var(--gold-deep)]">{String(cell.value).padStart(2, "0")}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--ink-muted)]">{cell.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

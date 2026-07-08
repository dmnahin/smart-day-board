const weekdayElement = document.querySelector("#weekday");
const todayDateElement = document.querySelector("#todayDate");
const monthLabel = document.querySelector("#monthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonthButton = document.querySelector("#prevMonth");
const nextMonthButton = document.querySelector("#nextMonth");
const numberA = document.querySelector("#numberA");
const numberB = document.querySelector("#numberB");
const operation = document.querySelector("#operation");
const calcResult = document.querySelector("#calcResult");
const habitScore = document.querySelector("#habitScore");
const habitInputs = document.querySelectorAll(".habits input");
const dailyNote = document.querySelector("#dailyNote");
const holidayList = document.querySelector("#holidayList");
const nextHoliday = document.querySelector("#nextHoliday");

const today = new Date();
let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const bangladeshHolidays2026 = [
  { date: "2026-02-04", name: "Shab-e-Barat", type: "Religious" },
  { date: "2026-02-21", name: "Language Movement Day", type: "National" },
  { date: "2026-03-17", name: "Night of Power", type: "Religious" },
  { date: "2026-03-20", name: "Jumu'atul-Wida", type: "Religious" },
  { date: "2026-03-19", name: "Eid al-Fitr Holiday", type: "Religious" },
  { date: "2026-03-20", name: "Eid al-Fitr Holiday", type: "Religious" },
  { date: "2026-03-21", name: "Eid al-Fitr", type: "Religious" },
  { date: "2026-03-22", name: "Eid al-Fitr Holiday", type: "Religious" },
  { date: "2026-03-23", name: "Eid al-Fitr Holiday", type: "Religious" },
  { date: "2026-03-26", name: "Independence Day", type: "National" },
  { date: "2026-04-14", name: "Pohela Boishakh", type: "National" },
  { date: "2026-05-01", name: "May Day", type: "National" },
  { date: "2026-05-01", name: "Buddha Purnima", type: "Religious" },
  { date: "2026-05-26", name: "Eid al-Adha Holiday", type: "Religious" },
  { date: "2026-05-27", name: "Eid al-Adha Holiday", type: "Religious" },
  { date: "2026-05-28", name: "Eid al-Adha", type: "Religious" },
  { date: "2026-05-29", name: "Eid al-Adha Holiday", type: "Religious" },
  { date: "2026-05-30", name: "Eid al-Adha Holiday", type: "Religious" },
  { date: "2026-05-31", name: "Eid al-Adha Holiday", type: "Religious" },
  { date: "2026-06-26", name: "Ashura", type: "Religious" },
  { date: "2026-08-05", name: "July Mass Uprising Day", type: "National" },
  { date: "2026-08-26", name: "Eid-e-Milad un-Nabi", type: "Religious" },
  { date: "2026-09-04", name: "Krishna Janmashtami", type: "Religious" },
  { date: "2026-10-21", name: "Vijayadashami", type: "Religious" },
  { date: "2026-12-16", name: "Victory Day", type: "National" },
  { date: "2026-12-25", name: "Christmas Day", type: "Religious" },
];

function formatDate(date, options) {
  return new Intl.DateTimeFormat("en", options).format(date);
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateTodayCard() {
  weekdayElement.textContent = formatDate(today, { weekday: "long" });
  todayDateElement.textContent = formatDate(today, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderCalendar() {
  calendarGrid.innerHTML = "";
  monthLabel.textContent = formatDate(visibleMonth, {
    month: "long",
    year: "numeric",
  });

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();
  const totalCells = 42;

  for (let cell = 0; cell < totalCells; cell += 1) {
    const dayBox = document.createElement("button");
    dayBox.type = "button";
    dayBox.className = "calendar-day";

    let dayNumber = cell - firstDayIndex + 1;
    let dateForCell = new Date(year, month, dayNumber);

    if (cell < firstDayIndex) {
      dayNumber = previousMonthDays - firstDayIndex + cell + 1;
      dateForCell = new Date(year, month - 1, dayNumber);
      dayBox.classList.add("is-muted");
    } else if (dayNumber > totalDays) {
      dayNumber -= totalDays;
      dateForCell = new Date(year, month + 1, dayNumber);
      dayBox.classList.add("is-muted");
    }

    const isToday =
      dateForCell.getFullYear() === today.getFullYear() &&
      dateForCell.getMonth() === today.getMonth() &&
      dateForCell.getDate() === today.getDate();

    if (isToday) {
      dayBox.classList.add("is-today");
    }

    const dateKey = getDateKey(dateForCell);
    const holidaysForDay = bangladeshHolidays2026.filter((holiday) => holiday.date === dateKey);

    dayBox.textContent = dayNumber;
    if (holidaysForDay.length > 0) {
      const holidayLabel = document.createElement("span");
      holidayLabel.className = "holiday-dot";
      holidayLabel.textContent = holidaysForDay[0].name;
      dayBox.classList.add("is-holiday");
      dayBox.append(holidayLabel);
    }

    dayBox.setAttribute("aria-label", formatDate(dateForCell, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }));
    calendarGrid.append(dayBox);
  }
}

function calculate() {
  const a = Number(numberA.value);
  const b = Number(numberB.value);
  const symbol = operation.value;

  const answers = {
    "+": a + b,
    "-": a - b,
    "*": a * b,
    "/": b === 0 ? "Cannot divide by 0" : a / b,
  };

  const answer = answers[symbol];
  calcResult.textContent = typeof answer === "number" ? Number(answer.toFixed(4)) : answer;
}

function updateHabitScore() {
  const completed = [...habitInputs].filter((input) => input.checked).length;
  habitScore.textContent = `${completed}/${habitInputs.length}`;
}

function loadNote() {
  dailyNote.value = localStorage.getItem("smartDayBoardNote") || "";
}

function renderHolidays() {
  holidayList.innerHTML = "";

  bangladeshHolidays2026.forEach((holiday) => {
    const item = document.createElement("div");
    item.className = "holiday-item";

    const date = new Date(`${holiday.date}T00:00:00`);
    item.innerHTML = `
      <span class="holiday-date">${formatDate(date, { month: "short", day: "numeric" })}</span>
      <span>
        <span class="holiday-name">${holiday.name}</span>
        <span class="holiday-type">${holiday.type}</span>
      </span>
    `;

    holidayList.append(item);
  });

  const upcoming = bangladeshHolidays2026.find((holiday) => {
    return new Date(`${holiday.date}T23:59:59`) >= today;
  });

  nextHoliday.textContent = upcoming ? `Next: ${upcoming.name}` : "2026 complete";
}

prevMonthButton.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
  renderCalendar();
});

[numberA, numberB, operation].forEach((control) => {
  control.addEventListener("input", calculate);
});

habitInputs.forEach((input) => {
  input.addEventListener("change", updateHabitScore);
});

dailyNote.addEventListener("input", () => {
  localStorage.setItem("smartDayBoardNote", dailyNote.value);
});

updateTodayCard();
renderCalendar();
calculate();
updateHabitScore();
loadNote();
renderHolidays();

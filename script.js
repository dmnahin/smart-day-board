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

const today = new Date();
let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

function formatDate(date, options) {
  return new Intl.DateTimeFormat("en", options).format(date);
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

    dayBox.textContent = dayNumber;
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

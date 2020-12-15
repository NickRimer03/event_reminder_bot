export const main = {
  prefix: "/! ",
  moderator: "351641561441763329",
  separators: [":", ".", ",", "/"],
};

export const regexp = {
  reg_time: "^\\d*[:.,/]?\\d*$",
};

export const texts = {
  botReady: "-- event_reminder_bot ready",
  noModeratorRole: "%0 You have no permissions to use this bot",
  incorrectNumberOfArguments: "%0 Incorrect number of arguments for command '%1'. Found: %2. Expected %3, %4 or %5.",
  unknownCommand: "%0 Unknown command: '%1'. Arguments: [%2]",
  timeFormatWrong: "%0 Expected 3rd argument to be 'am' or 'pm'. Found: '%1'",
  timeSeparatorWrong: "%0 Expected minutes separator to be one of this list: [%1]",
  wrongTimeValue: "%0 '%1' is wrong for %2. Expected value to be 0..12",
  argTimeIsNotATime: "%0 Argument error: invalid time format. Found: '%1'. Expected: e.g. '10:30'",
  timerNameExists: "%0 Timer named '%1' already exists",
  noTimerName: "%0 No timer named '%1'",
  modeWrong: "%0 Expected 2rd argument to be 'start' or 'stop'. Found: '%1'",
  stoppingError: "%0 Can't stop the timer. It's not started",
  startingError: "%0 Can't start the timer. Already started",
  setTimer: "%0 Timer '%1' is set at %2:%3 %4 UTC",
  timerStopped: "%0 Timer '%1' stopped",
  alarm: "%0 Alarm! %1",
};

export default { main, regexp, texts };

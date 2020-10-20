import "/assets/js/probability-distributions-bundle.js";

export const ticketWorkColors = d3.schemeSet3
  .slice(0, 2)
  .concat(d3.schemeSet3.slice(4, 8))
  .concat(d3.schemeSet3[11]);
const lunchColor = d3.schemeSet3[10];
const meetingColor = d3.schemeSet3[9];
const regressionTestingColor = d3.schemeSet3[3];
const contextSwitchColor = d3.schemeSet3[8];
const nothingColor = "#fff";

export function color(event) {
  if (event instanceof ScheduledTicketWork) {
    return ticketWorkColors[
      event.ticket.number % (ticketWorkColors.length - 1)
    ];
  } else if (event instanceof LunchBreak) {
    return lunchColor;
  } else if (event instanceof RegressionTesting) {
    return regressionTestingColor;
  } else if (event instanceof Meeting) {
    return meetingColor;
  } else if (event instanceof ContextSwitchEvent) {
    return contextSwitchColor;
  }
  return nothingColor;
}

export const workerIdentifierColors = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

export class Event {
  constructor(startTime, duration, owner, day, title = null) {
    this.startTime = startTime;
    this.duration = duration;
    this.endTime = startTime + duration;
    this.owner = owner;
    this.day = day;
    // this.sprintDay = this.day - this.owner.regressionTestDayCount + 1;
    this.rawStartDayTime = this.day * 480 + this.startTime;
    this.rawEndDayTime = this.rawStartDayTime + this.duration;
    this.title = title || this.title;
  }
  get sprintDay() {
    return this.day - this.owner.regressionTestDayCount + 1;
  }
  get color() {
    return d3.color(color(this));
  }
}

export class Meeting extends Event {}

class DailyStandup extends Meeting {
  title = "Daily Standup";
  constructor(owner, day) {
    super(0, 15, owner, day);
  }
}

class SprintPlanning extends Meeting {
  title = "Sprint Planning";
  constructor(owner, day) {
    super(0, 120, owner, day);
  }
}

class SprintRetro extends Meeting {
  title = "Sprint Retro";
  constructor(owner, day) {
    super(420, 60, owner, day);
  }
}

export class RegressionTesting extends Event {
  title = "Regression Testing";
}

class NothingEvent extends Event {
  // Nothing is done during this period of time. This is solely used to make logic
  // easier, and is placed in a schedule when it's determined that no work can be done
  // because it will take too long to switch contexts and get anything productive
  // done.
  title = "Nothing";
}

class ContextSwitchEvent extends Event {
  title = "Context Switching";
  constructor(
    startTime,
    duration,
    ticket,
    firstIteration = true,
    lastIteration = true,
    owner,
    day
  ) {
    super(startTime, duration, owner, day);
    this.ticket = ticket;
    this.firstIteration = firstIteration;
    this.lastIteration = lastIteration;
  }
}

export class LunchBreak extends Meeting {
  // Extends Meeting because meetings can be stacked back to back without having to
  // worry about context switching between them, and when leading up to a meeting, if
  // the prior Event ended less than or equal to 30 minutes before it, then new work
  // won't be started. These are all true for Lunch as well.
  title = "Lunch";
  constructor(lunchTime, owner, day) {
    super(lunchTime, 60, owner, day);
  }
}

class LunchAndLearn extends LunchBreak {
  // Just like lunch, except treated like a meeting. Can replace any instance of
  // lunch, provided it doesn't conflict.
  title = "Lunch & Learn";
}

export class ScheduledTicketWork extends Event {
  // ScheduledTicketWork is work for a ticket that either a programmer or tester is
  // doing. ScheduledTicketWork will always require up to 30 minutes after any prior
  // event in order to context switch. If 30 minutes or less would only be available
  // before the next event, then work on a new ticket won't be scheduled. But if work
  // was already being done on a ticket, an attempt to schedule some work will be made,
  // although it may be only enough to context switch before time runs out.
  constructor(
    startTime,
    duration,
    ticket,
    contextSwitchEvent,
    firstIteration = true,
    lastIteration = true,
    owner,
    day
  ) {
    super(startTime, duration, owner, day);
    this.ticket = ticket;
    this.contextSwitchEvent = contextSwitchEvent;
    this.firstIteration = firstIteration;
    this.lastIteration = lastIteration;
  }
}

class ScheduledNewTicketWork extends ScheduledTicketWork {
  // This is exactly like ScheduledTicketWork, except it can't be placed in between a
  // prior event's end and a Meeting (even Lunch), if that next Meeting starts 30
  // minutes or less after the prior event.
}
export class ScheduledTicketProgrammingWork extends ScheduledTicketWork {
  title = "Programming Work";
}
export class ScheduledTicketCheckingWork extends ScheduledTicketWork {
  title = "Checking";
}
export class ScheduledTicketAutomationWork extends ScheduledTicketWork {
  title = "Automation";
}
export class ScheduledTicketCodeReviewWork extends ScheduledTicketWork {
  title = "Code Review";
}

class ScheduledNewTicketProgrammingWork extends ScheduledTicketProgrammingWork {}
class ScheduledNewTicketCheckingWork extends ScheduledTicketCheckingWork {}
class ScheduledNewTicketAutomationWork extends ScheduledTicketAutomationWork {}
class ScheduledNewTicketCodeReviewWork extends ScheduledTicketCodeReviewWork {}

class ScheduledPreviouslyInterruptedTicketProgrammingWork extends ScheduledTicketProgrammingWork {}
class ScheduledPreviouslyInterruptedTicketCheckingWork extends ScheduledTicketCheckingWork {}
class ScheduledPreviouslyInterruptedTicketAutomationWork extends ScheduledTicketAutomationWork {}
class ScheduledPreviouslyInterruptedTicketCodeReviewWork extends ScheduledTicketCodeReviewWork {}

class ScheduledPreviouslyInterruptedTicketWork extends ScheduledTicketWork {
  // Represents follow-up work for a work iteration that was interrupted and context
  // had to be re-acquired.
}

class AvailableTimeSlot {
  constructor(nextMeetingIndex, startTime, endTime) {
    this.nextMeetingIndex = nextMeetingIndex;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = endTime - startTime;
  }
  get previousMeetingIndex() {
    return [null, 0].includes(this.nextMeetingIndex) ? null : this.nextMeetingIndex - 1;
  }
}

class DaySchedule {
  constructor(lunchTime, owner, day) {
    this.owner = owner;
    this.day = day;
    this.sprintDay = this.day - this.owner.regressionTestDayCount + 1;
    this.items = [];
    this.lastMeetingIndexBeforeAvailability = null;
    this.availableTimeSlots = [new AvailableTimeSlot(null, 0, 480)];
    let lunch = new LunchBreak(lunchTime, this.owner, this.day);
    this.scheduleMeeting(lunch);
  }

  scheduleMeeting(meeting) {
    // assumes meetings are set first and were set in order
    if (this.availableTimeSlots.length === 0) {
      throw Error("No available time to schedule meetings");
    }
    const newAvailableTimeSlots = [];
    // track the number of meetings added so that NothingEvents can also impact the
    // later AvailableTimeSlot's nextMeetingIndex attribute.
    let meetingsAdded = 0;
    let matchingTimeSlotIndex = 0;
    for (let timeSlotIndex in this.availableTimeSlots) {
      const timeSlot = this.availableTimeSlots[timeSlotIndex];
      timeSlot.nextMeetingIndex += meetingsAdded;
      if (!meetingsAdded && meeting.startTime >= timeSlot.startTime && meeting.endTime <= timeSlot.endTime) {
        // meeting fits here
        matchingTimeSlotIndex = timeSlotIndex;

        // Add possible NothingEvent to schedule items, or AvailableTimeSlot to schedule's available time slots.
        const startTimeDiff = meeting.startTime - timeSlot.startTime;
        if (startTimeDiff > 0) {
          if (startTimeDiff <= 30) {
            // just enough time to do nothing
            this.items.splice(timeSlot.nextMeetingIndex, 0, new NothingEvent(timeSlot.startTime, startTimeDiff, this.owner, this.day));
            meetingsAdded += 1;
          } else {
            newAvailableTimeSlots.push(new AvailableTimeSlot(timeSlot.nextMeetingIndex, timeSlot.startTime, meeting.startTime));
          }
        }

        // add meeting to schedule items
        this.items.splice(timeSlot.nextMeetingIndex, 0, meeting);
        meetingsAdded += 1;

        // Add possible NothingEvent to schedule items, or AvailableTimeSlot to schedule's available time slots.
        const endTimeDiff = timeSlot.endTime - meeting.endTime;
        if (endTimeDiff > 0) {
          const nextMeetingIndex = timeSlot.nextMeetingIndex + meetingsAdded;
          if (endTimeDiff <= 30 && !(meeting instanceof ContextSwitchEvent)) {
            // just enough time to do nothing
            this.items.splice(nextMeetingIndex, 0, new NothingEvent(timeSlot.startTime, endTimeDiff, this.owner, this.day));
          } else {
            // still room to do something (or the next thing being scheduled will be the ticket work)
            newAvailableTimeSlots.push(new AvailableTimeSlot(nextMeetingIndex, meeting.endTime, timeSlot.endTime));
          }
        }
      }
    }
    if (!meetingsAdded) {
      // event conflicts
      throw Error("Event conflicts with another event");
    }
    // Merge in newly defined AvailableTimeSlots if applicable.
    this.availableTimeSlots.splice(matchingTimeSlotIndex, 1, ...newAvailableTimeSlots);
  }
}

class NoAvailableTimeSlotsError extends Error {
  constructor(...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoAvailableTimeSlotsError);
    }

    this.name = "NoAvailableTimeSlotsError";
  }
}

class Schedule {
  constructor(
    sprintDayCount,
    regressionTestDayCount,
    lunchTime,
    customEventsByDay,
    owner
  ) {
    // The "first" ${regressionTestDayCount} days of the sprint are actually
    // the last days of the previous sprint when the tester is doing the
    // regression tests, and it is assumed that the programmers are getting
    // a head start on next sprint, and are only working on tickets for that
    // next sprint. Their work is simulated for these days both to reflect
    // that programmers would normally be continuing work during this time,
    // but also so that the tester's schedule starts out on the first day of
    // the sprint with ticket work to do. Metrics will be gathered for all
    // days, even those from the last days of the previous sprint to reflect
    // the impact of this process from a holistic perspective.
    this.owner = owner;
    this.daySchedules = [];
    this.sprintDayCount = sprintDayCount;
    this.regressionTestDayCount = regressionTestDayCount;
    this.customEventsByDay = customEventsByDay;
    for (
      let i = 0;
      i < this.sprintDayCount + this.regressionTestDayCount;
      i++
    ) {
      const customEvents = this.customEventsByDay[i];
      let schedule = new DaySchedule(lunchTime, this.owner, i);
      for (const event of customEvents) {
        event.owner = this.owner;
        schedule.scheduleMeeting(event);
      }
      if (i === regressionTestDayCount) {
        // first actual day of sprint, so sprint planning
        schedule.scheduleMeeting(new SprintPlanning(this.owner, i));
      } else {
        schedule.scheduleMeeting(new DailyStandup(this.owner, i));
      }
      this.daySchedules.push(schedule);
    }
    this.daySchedules[regressionTestDayCount - 1].scheduleMeeting(
      new SprintRetro(this.owner, regressionTestDayCount - 1)
    );
    this.daySchedules[this.daySchedules.length - 1].scheduleMeeting(
      new SprintRetro(this.owner, this.daySchedules.length - 1)
    );
    this.dayOfNextWorkIterationCompletion = null;
    this.timeOfNextWorkIterationCompletion = null;
    this.lastTicketWorkedOn = null;
  }

  get earliestAvailableDayForWorkIndex() {
    for (let daySchedule of this.daySchedules) {
      if (daySchedule.availableTimeSlots.length > 0) {
        return daySchedule.day;
      }
    }
    return -1;
  }

  get earliestAvailableDayScheduleForWork() {
    if (this.earliestAvailableDayForWorkIndex === -1) {
      return null;
    }
    return this.daySchedules[this.earliestAvailableDayForWorkIndex];
  }

  addWork(ticket) {
    // assumes the meetings have already been defined and that work is being added
    // in the earliest available, viable time slot.
    this.lastTicketWorkedOn = ticket;
    let queue = this.getWorkIterationQueueFromTicket(ticket);
    let workIteration = queue.shift();
    this.copyOfLastWorkIterationTime = workIteration.time;
    let needsCodeReview = !!ticket.needsCodeReview;
    let needsAutomation = !!ticket.needsAutomation;
    let firstIteration = ticket.firstIteration;
    let finalIteration = !queue.length;
    let lastWorkEvent;
    while (workIteration.time > 0) {
      // work has a potential of being completed on the currently considered day,
      // but if it isn't, this.earliestAvailableDayForWorkIndex will be updated to
      // the next day that the work for this ticket could possibly be completed on
      // and when this iterates through again, it will possibly be correct. This
      // will repeat until eventually it is correct because
      // this.earliestAvailableDayForWorkIndex will have been the day that the
      // last of the work for this work iteration would be scheduled.
      this.dayOfNextWorkIterationCompletion = this.earliestAvailableDayForWorkIndex;
      if (this.earliestAvailableDayForWorkIndex === -1) {
        this.owner.nextWorkIterationCompletionCheckIn = -1;
        throw RangeError(
          "Not enough time left in the sprint to finish this ticket"
        );
      }
      let schedule = this.earliestAvailableDayScheduleForWork;
      let contextSwitchTime = Math.round(Math.random() * (30 - 10) + 10);
      let contextSwitchEvent = new ContextSwitchEvent(
        schedule.availableTimeSlots[0].startTime,
        contextSwitchTime,
        ticket,
        firstIteration,
        finalIteration,
        this.owner,
        this.earliestAvailableDayForWorkIndex
      );
      schedule.scheduleMeeting(contextSwitchEvent);
      let newWorkEvent;
      // distinguish between interrupted work, and non-interrupted work
      let scheduledWorkClass;
      if (needsCodeReview) {
        scheduledWorkClass = workIteration.started
          ? ScheduledPreviouslyInterruptedTicketCodeReviewWork
          : ScheduledNewTicketCodeReviewWork;
      } else if (needsAutomation) {
        scheduledWorkClass = workIteration.started
          ? ScheduledPreviouslyInterruptedTicketAutomationWork
          : ScheduledNewTicketAutomationWork;
      } else {
        scheduledWorkClass = workIteration.started
          ? this.scheduledPreviouslyInterruptedTicketWork
          : this.scheduledNewTicketWork;
      }
      workIteration.started = true;
      if (schedule.availableTimeSlots[0].duration >= workIteration.time) {
        // enough time to complete the iteration
        newWorkEvent = new scheduledWorkClass(
          contextSwitchEvent.endTime,
          workIteration.time,
          ticket,
          contextSwitchEvent,
          firstIteration,
          finalIteration,
          this.owner,
          this.earliestAvailableDayForWorkIndex
        );
        this.timeOfNextWorkIterationCompletion = newWorkEvent.endTime;
      } else {
        // not enough time to complete the iteration
        newWorkEvent = new scheduledWorkClass(
          contextSwitchEvent.endTime,
          schedule.availableTimeSlots[0].duration,
          ticket,
          contextSwitchEvent,
          firstIteration,
          finalIteration,
          this.owner,
          this.earliestAvailableDayForWorkIndex
        );
      }
      workIteration.time -= newWorkEvent.duration;
      schedule.scheduleMeeting(newWorkEvent);
      lastWorkEvent = newWorkEvent;
    }
    if (lastWorkEvent) {
      this.owner.nextWorkIterationCompletionCheckIn = (lastWorkEvent.day * 480) + lastWorkEvent.endTime;
    }
    // Because of how the logic works, the ticket's
    // 'needsCodeReview'/'needsAutomation' status may be misleading during a
    // simulation. The ticket's 'needsCodeReview'/'needsAutomation'
    // status is set to true immediately after the work iteration for that ticket was
    // scheduled, or set to false immediately after the work iteration for code
    // review/checking was scheduled. So if a programmer grabbed a ticket to code
    // review it changes at 001, and it would take them until 030 to finish, the work
    // would be scheduled when the simulation is at 001, and the 'needsCodeReview'
    // status of the ticket would be set to false, even though the simulation would
    // still be at 001. This works similarly for a tester doing checking.
    //
    // Because of this, be mindful of the point in the iteration of the
    // simulation loop that this information is being queried at. For logging
    // the stack, this is done at the beginning of the iteration before any new
    // scheduling of work occurs (to better indicate the boundaries of when the
    // stacks changed). So if a ticket that a programmer was working on at that
    // moment had 'needsCodeReview' set to false, it would mean that that
    // programmer was doing code review on that ticket, rather than writing the
    // code for it.
    if (this.owner instanceof Programmer) {
      // If the Programmer just finished scheduling the changes for this ticket,
      // then the ticket will need to be code reviewed by another programmer. If
      // a programmer just code reviewed it, it should be set to false and then
      // passed to QA. If QA needs to send it back to the original programmer,
      // then it staying set to false will make sure that code review work isn't
      // scheduled by mistake.
      ticket.needsCodeReview = !needsCodeReview;
    }
    if (this instanceof QaSchedule && queue.length === 0) {
      // final check has just been completed
      ticket.needsAutomation = !needsAutomation;
    }
  }
}

class ProgrammerSchedule extends Schedule {
  scheduledNewTicketWork = ScheduledNewTicketProgrammingWork;
  scheduledPreviouslyInterruptedTicketWork = ScheduledPreviouslyInterruptedTicketProgrammingWork;
  getWorkIterationQueueFromTicket(ticket) {
    if (ticket.needsCodeReview) {
      return ticket.programmerCodeReviewWorkIterations;
    }
    return ticket.programmerWorkIterations;
  }
}

class QaSchedule extends Schedule {
  scheduledNewTicketWork = ScheduledNewTicketCheckingWork;
  scheduledPreviouslyInterruptedTicketWork = ScheduledPreviouslyInterruptedTicketCheckingWork;
  constructor(
    sprintDayCount,
    regressionTestDayCount,
    lunchTime,
    customEventsByDay,
    owner
  ) {
    super(
      sprintDayCount,
      regressionTestDayCount,
      lunchTime,
      customEventsByDay,
      owner
    );
    for (let i = 0; i < regressionTestDayCount; i++) {
      let previousSprintDaySchedule = this.daySchedules[i];
      let currentSprintI =
        this.daySchedules.length - (regressionTestDayCount - i);
      let currentSprintDaySchedule = this.daySchedules[currentSprintI];
      // regression tests from previous sprint
      while (previousSprintDaySchedule.availableTimeSlots.length > 0) {
        const timeSlot = previousSprintDaySchedule.availableTimeSlots[0];
        previousSprintDaySchedule.scheduleMeeting(
          new RegressionTesting(timeSlot.startTime, timeSlot.duration, this.owner, i)
        );
      }
      while (currentSprintDaySchedule.availableTimeSlots.length > 0) {
        const timeSlot = currentSprintDaySchedule.availableTimeSlots[0];
        currentSprintDaySchedule.scheduleMeeting(
          new RegressionTesting(timeSlot.startTime, timeSlot.duration, this.owner, i)
        );
      }
    }
  }
  getWorkIterationQueueFromTicket(ticket) {
    if (ticket.needsAutomation) {
      return ticket.automationWorkIterations;
    }
    return ticket.testerWorkIterations;
  }
}

class Worker {
  constructor(
    sprintDayCount,
    regressionTestDayCount,
    lunchTime,
    customEventsByDay
  ) {
    this.tickets = [];
    this.sprintDayCount = sprintDayCount;
    this.regressionTestDayCount = regressionTestDayCount;
    this.lunchTime = lunchTime;
    this.customEventsByDay = customEventsByDay;
    this.nextWorkIterationCompletionCheckIn = null;

    // These arrays track the minutes in the dayTime format (e.g. 1455 for day 4 at
    // 10AM), which will be useful for determining how much time was spent on
    // a particular event type up to a certain dayTime, because the index of that
    // dayTime (plus 1) will be the total amount of minutes spent doing that kind of
    // event up until that dayTime. An optimized binary search (possibly changing
    // for each event type for better performance) can be used to efficiently find
    // a given dayTime, using techniques such as setting the given dayTime as the
    // search's upper bound index (after subtracting the time for regression tests,
    // as those minutes from the previous sprint aren't tracked).
    //
    // If the searched for time doesn't match a minute that was tracked (e.g. a
    // dayTime of 1678 was searched for to find meeting minutes, but on meetings
    // were happening at that time), then the search algorithm can just round down
    // to the closest minute that it can find, which makes searching still cheap.
    //
    // This simulation requires the regression test period from the previous sprint
    // to also be simulated (as it reflects real scenarios and creates a basis of
    // available work so QA can start on tickets on the first day of the observed
    // sprint), and those minutes are counted to show how this process affects
    // things from a holistic perspective.
    this.contextSwitchingMinutes = [];
    this.meetingMinutes = [];
    this.productiveTicketWorkMinutes = [];
    this.codeReviewWorkMinutes = [];
    // working on a ticket that had to be sent back
    //
    // Testers will actually write to this array unless it's their final iteration
    // of work on this ticket before sending it to "done". This is done to reflect
    // that the tester, for every work iteration, will have to repeat the entire
    // collection of tests for that ticket until they either find a problem and send
    // it back, or it's all good. So it reflects the repetitive nature of that work.
    this.productiveTicketFixWorkMinutes = [];
    // TODO: This array tracks minutes that were spent recovering from an interruption,
    // other than Lunch, and an end of day that was reached without going through a
    // meeting. So if the day ended with SprintRetro, and the worker was in the
    // middle of a work iteration, the ContextSwitchEvent before they began work on
    // that work iteration would count towards this, as would a meeting in the
    // middle of the day. This may not be immediately relevant, but may come in
    // handy if other meetings are implemented.
    this.productivityRecoveryMinutes = [];
    this.checkingMinutes = [];
    this.regressionTestingMinutes = [];
    this.automationMinutes = [];
    // Time spent doing nothing because there was no time to get started on anything
    // before a meeting, lunch, or the end of the day came up.
    this.nothingMinutes = [];

    this.initializeSchedule();
    this.minutesGenerated = false;
  }
  processEventMinutes() {
    // Called at the end of the simulation, as the events will all be added and this
    // can most efficiently iterate over them to determine the minutes and load them
    // into the minute arrays.
    for (let day of this.schedule.daySchedules) {
      for (let event of day.items) {
        // generates range of numbers representing the duration of the event for
        // the time range it took place. A 1 is added in the mapping to reflect
        // how the information would be queried for. A meeting can start at
        // dayTime 0, but if that dayTime is queried for, the response should be
        // 0 minutes. The index of the timestamp plus 1 represents the number of
        // minutes of the cumulative duration of events of that type.
        let eventMinutes = [...Array(event.duration).keys()].map(
          (i) => i + event.rawStartDayTime + 1
        );

        // standalone if statements are used because the minutes for one event
        // category may apply to more than one event minute array.
        if (event instanceof Meeting) {
          this.meetingMinutes.push(...eventMinutes);
        }
        if (event instanceof ContextSwitchEvent) {
          this.contextSwitchingMinutes.push(...eventMinutes);
        }
        if (event instanceof ScheduledTicketWork) {
          this.productiveTicketWorkMinutes.push(...eventMinutes);
          if (this instanceof Programmer && !event.firstIteration) {
            this.productiveTicketFixWorkMinutes.push(...eventMinutes);
          }
          if (this instanceof Tester && !event.finalIteration) {
            this.productiveTicketFixWorkMinutes.push(...eventMinutes);
          }
        }
        if (event instanceof ScheduledTicketCodeReviewWork) {
          this.codeReviewWorkMinutes.push(...eventMinutes);
        }
        if (event instanceof ContextSwitchEvent) {
          // TODO
          // this.productivityRecoveryMinutes.push(...eventMinutes);
        }
        if (event instanceof ScheduledTicketCheckingWork) {
          this.checkingMinutes.push(...eventMinutes);
        }
        if (event instanceof RegressionTesting) {
          this.regressionTestingMinutes.push(...eventMinutes);
        }
        if (event instanceof ScheduledTicketAutomationWork) {
          this.automationMinutes.push(...eventMinutes);
        }
        if (event instanceof NothingEvent) {
          this.nothingMinutes.push(...eventMinutes);
        }
      }
    }
    this.minutesGenerated = true;
  }
  getMeetingMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(this.meetingMinutes, dayTime);
  }
  getContextSwitchingMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.contextSwitchingMinutes,
      dayTime
    );
  }
  getProductiveTicketWorkMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.productiveTicketWorkMinutes,
      dayTime
    );
  }
  getProductiveTicketFixWorkMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.productiveTicketFixWorkMinutes,
      dayTime
    );
  }
  getCodeReviewWorkMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(this.codeReviewWorkMinutes, dayTime);
  }
  getProductivityRecoveryMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.productivityRecoveryMinutes,
      dayTime
    );
  }
  getRegressionTestingMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.regressionTestingMinutes,
      dayTime
    );
  }
  getCheckingMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.checkingMinutes,
      dayTime
    );
  }
  getAutomationMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(
      this.automationMinutes,
      dayTime
    );
  }
  getNothingMinutesAtDayTime(dayTime) {
    return this.getMinutesOfTypeAtDayTime(this.nothingMinutes, dayTime);
  }
  getMinutesOfTypeAtDayTime(minutesArr, dayTime) {
    // binary search
    //
    // Finds the index of the dayTime, or the index representing a dayTime that's
    // the closest to the desired dayTime without going over. The index of that
    // dayTime represents the number of minutes spent on that particular type up to
    // that point in time.
    if (!this.minutesGenerated) {
      this.processEventMinutes();
    }
    if (minutesArr.length === 0) {
      return 0;
    }

    let ceilingIndex = Math.min(dayTime, minutesArr.length) - 1;
    let ceilingValue = minutesArr[ceilingIndex];
    if (ceilingValue <= dayTime) {
      // rule out the initial ceiling value to make the while loop more efficient.
      // If it's ruled out here, the loop can assume that at some point, the
      // ceilingIndex will have been a currentIndex in a previous iteration.
      return ceilingIndex + 1;
    }

    let floorIndex = 0;
    let floorValue = minutesArr[floorIndex];
    if (floorValue > dayTime) {
      return 0;
    } else if (floorValue === dayTime) {
      return 1;
    }
    while (true) {
      let currentIndex = Math.round((floorIndex + ceilingIndex) / 2);
      let foundTime = minutesArr[currentIndex];
      if (foundTime === dayTime) {
        return currentIndex + 1;
      }
      if (foundTime < dayTime) {
        if (ceilingIndex - currentIndex === 1) {
          // either the currentIndex or the ceilingIndex points at the
          // appropriate minute count, and the ceilingIndex was either ruled
          // out before the loop, or in a previous iteration.
          return currentIndex + 1;
        }
        // shift right to the next iteration
        floorIndex = currentIndex;
        continue;
      }
      // foundTime must be greater than the dayTime, but the dayTime must also be
      // greater than the floorValue
      if (currentIndex - floorIndex === 1) {
        // the floorIndex is the only index representing the closest minute to
        // the dayTime without going over
        return floorIndex + 1;
      }
      // shift left to the next iteration
      ceilingIndex = currentIndex;
      continue;
    }
  }
  clearSchedule() {
    delete this.schedule;
    this.initializeSchedule();
  }
  addTicket(ticket) {
    if (!this.tickets.includes(ticket)) {
      this.tickets.push(ticket);
    }
  }
  get nextCheckInTime() {
    // The next time this worker should be checked in on, either because they would
    // have just finished working on an iteration of a ticket, or they would have
    // time available to work then.
    let iterationCompleteCheckIn = this.nextWorkIterationCompletionCheckIn;
    let availabilityCheckIn = this.nextAvailabilityCheckIn;
    if (iterationCompleteCheckIn === null) {
      // work hasn't been added yet, so there isn't a need to check for completed
      // work, and this can defer to the availability
      return availabilityCheckIn;
    }
    // there is a chance that earliest day/time may be -1, but that would mean
    // that there's no time left in the sprint, so there'd be no reason to check
    // in on this worker. As a result, this evaluating to a negative number is
    // expected as it can be used in other contexts.
    return Math.min(iterationCompleteCheckIn, availabilityCheckIn);
  }

  get nextAvailabilityCheckIn() {
    // The return value is in minutes, but each day prior is multiplied by 480 (the
    // number of minutes in a day) and then added to the minutes. So if the next
    // check-in time should be on the 5th day (which is actually the 4th because of
    // zero indexing) at the 332 minute, that would be (4 * 480) + 332.
    //
    // If needed, the day can be found again by dividing by 480 and then rounding
    // down.
    let earliestDayIndex = this.schedule.earliestAvailableDayForWorkIndex;
    if (earliestDayIndex < 0) {
      return -1;
    }
    let earliestTime = this.schedule.daySchedules[earliestDayIndex].availableTimeSlots[0].startTime;
    return earliestTime + (earliestDayIndex * 480);
  }
}

export class Programmer extends Worker {
  initializeSchedule() {
    this.schedule = new ProgrammerSchedule(
      this.sprintDayCount,
      this.regressionTestDayCount,
      this.lunchTime,
      this.customEventsByDay,
      this
    );
  }
}

export class Tester extends Worker {
  initializeSchedule() {
    this.schedule = new QaSchedule(
      this.sprintDayCount,
      this.regressionTestDayCount,
      this.lunchTime,
      this.customEventsByDay,
      this
    );
  }
}

class WorkIteration {
  constructor(time) {
    this.time = time;
    this.started = false;
  }
}

class Ticket {
  constructor(
    number,
    priority,
    programmerWorkIterations,
    programmerCodeReviewWorkIterations,
    testerWorkIterations,
    qaAutomationIteration,
    totalTimesToBeSentBack
  ) {
    // the ticket number used to uniquely identify it
    this.number = number;
    // the ticket's importance represented as a number. The lower the number, the
    // higher the priority
    this.priority = priority;
    // an array of amounts of uninterrupted time it will take the programmer to
    // complete an iteration of the ticket's implementation before sending it off to
    // QA
    this.programmerWorkIterations = programmerWorkIterations;
    this.programmerCodeReviewWorkIterations = programmerCodeReviewWorkIterations;
    // The amount of uninterrupted time it will take the tester to manually test the
    // ticket
    this.testerWorkIterations = testerWorkIterations;
    // The amount of uninterrupted time it will take the tester to write the
    // high-level automated tests for this ticket
    this.automationWorkIterations = [qaAutomationIteration];
    // The amount of times this ticket would have to be sent back to the programmer
    // before it would be completed.
    this.totalTimesToBeSentBack = totalTimesToBeSentBack;
    this.initialProgrammerWorkIterationTime = this.programmerWorkIterations[0].time;
    this.initialProgrammerCodeReviewWorkIterationTime = this.programmerCodeReviewWorkIterations[0].time;
    this.initialTesterWorkIterationTime = this.testerWorkIterations[0].time;
    this.initialTesterAutomationWorkIterationTime = this.automationWorkIterations[0].time;
    // After the programmer has done work on the ticket, it will need code review
    // before being passed off to QA. Only once that work is done (or at least
    // scheduled) is this set to true.
    this.needsCodeReview = false;
    this.needsAutomation = false;
    // Whether or not any work has begun on this ticket or not. Used to track
    // metrics relating to work that was done in repeated iterations of work for
    // tickets needed. For programmers, this means any work iteration that wasn't
    // the very first for the ticket. For testers, this means any iteration that
    // wasn't the last iteration.
    this.fresh = true;
  }
}

class TicketFactory {
  // start the number off higher than 0 to make it more interesting
  startingTicketNumber = 100;
  constructor(
    maxInitialProgrammerWorkTimeInHours = 16,
    maxFullRunTesterWorkTimeInHours = 8,
    maxQaAutomationTime = 8,
    averagePassBackCount = 1
  ) {
    // maxInitialProgrammerWorkTimeInHours is the time it takes for the programmer to
    // write the initial implementation that they believe meets the ticket's criteria.
    //
    // maxFullRunTesterWorkTimeInHours is the time it would take the tester to
    // completely run through the tests they have for a ticket, assuming everything is
    // working.
    //
    // They are phrased and treated differently, because the programmer does everything
    // in one iteration, and then refines in later iterations, but the tester can't do
    // everything in one go if something is wrong, and can only do the full run in one
    // shot if everything is working. So the programmer's likely highest iteration time
    // will be on their first iteration, while the tester's likely highest iteration
    // time will be on their last iteration.
    this.maxInitialProgrammerWorkTimeInHours = maxInitialProgrammerWorkTimeInHours;
    this.maxFullRunTesterWorkTimeInHours = maxFullRunTesterWorkTimeInHours;
    this.maxQaAutomationTime = maxQaAutomationTime;
    this.averagePassBackCount = averagePassBackCount;
    this.maxCodeReviewTimeInHours = 0.5;
    this.ticketsMade = 0;
  }
  generateTicket() {
    const initialProgrammerWorkTime = this.generateInitialProgrammerWorkTime();
    const fullRunTesterWorkTime = this.generateFullRunTesterWorkTime();
    const fullRunCodeReviewWorkTime = this.generateCodeReviewWorkIterationTime();
    const programmerWorkIterations = [initialProgrammerWorkTime];
    const testerWorkIterations = [];
    const programmerCodeReviewWorkIterations = [];
    const passBackCount = this.generateTicketPassBackCount();
    programmerWorkIterations.push(
      ...this.sampleFixWorkIterationTime(
        initialProgrammerWorkTime,
        passBackCount
      )
    );
    programmerCodeReviewWorkIterations.push(
      ...this.sampleFixWorkIterationTime(
        fullRunCodeReviewWorkTime,
        passBackCount
      ),
      fullRunCodeReviewWorkTime
    );
    testerWorkIterations.push(
      ...this.sampleFixWorkIterationTime(fullRunTesterWorkTime, passBackCount),
      fullRunTesterWorkTime
    );
    // QA Automation doesn't require iterations because the person doing it makes sure
    // it's working as expected while doing the work
    const qaAutomationIteration = this.generateQaAutomationWorkIteration();
    const priority = Math.round(Math.random() * 100);

    const ticket = new Ticket(
      this.startingTicketNumber + this.ticketsMade,
      priority,
      programmerWorkIterations,
      programmerCodeReviewWorkIterations,
      testerWorkIterations,
      qaAutomationIteration,
      passBackCount
    );
    this.ticketsMade += 1;
    return ticket;
  }
  generateInitialProgrammerWorkTime() {
    return this.sampleInitialProgrammerWorkTime(1)[0];
  }
  sampleInitialProgrammerWorkTime(sampleCount) {
    return this.sampleWorkIterationTime(
      this.maxInitialProgrammerWorkTimeInHours,
      sampleCount
    );
  }
  generateFullRunTesterWorkTime() {
    return this.sampleFullRunTesterWorkTime(1)[0];
  }
  sampleFullRunTesterWorkTime(sampleCount) {
    return this.sampleWorkIterationTime(
      this.maxFullRunTesterWorkTimeInHours,
      sampleCount
    );
  }
  sampleWorkIterationTime(maxTimeInHours, sampleCount) {
    if (sampleCount <= 0) {
      return [];
    }
    const minimumWorkTimeInMinutes = 30;
    const sample = PD.rgamma(sampleCount, 3, 0.1).map((maxWorkTimeValue) => {
      const maxWorkTimePercentage = Math.min(maxWorkTimeValue / 100.0, 1);
      return new WorkIteration(
        Math.round(maxTimeInHours * maxWorkTimePercentage * 60) +
          minimumWorkTimeInMinutes
      );
    });
    return sample;
  }
  sampleFixWorkIterationTime(baseWorkIteration, sampleCount) {
    // when a ticket is sent back to the programmer from QA, a fix is likely to take
    // less time than the initial work, but it's still possible for it to take more
    // time. This gamma probability distribution is used to determine the percentage of
    // the initial work time that it will take to fix the issue the tester found. It has
    // a significant lean towards 0% (with a 10 minute minimum), but also makes it
    // possible for the percentage to exceed 100%, meaning it could take longer to
    // create a potential fix than the initial implementation, and this reflects finding
    // a serious issue with the implementation and possibly overall design of the code.
    //
    // For testers, it's similar. But any increases over the base work time can be
    // chalked up to the tester trying to determine what exactly is wrong, or possibly
    // struggling to get the system to work if it's particularly problematic.
    //
    // It's sometimes the same for code review, but this simulation makes the assumption
    // that it is the same for code review as it is for testers checking.
    if (sampleCount <= 0) {
      return [];
    }
    const minimumWorkTimeInMinutes = 30;
    const sample = PD.rgamma(sampleCount, 1, 5).map((fixWorkTimeValue) => {
      const fixWorkTimePercentage = Math.min(fixWorkTimeValue / 100.0, 1);
      return new WorkIteration(
        Math.round(baseWorkIteration * fixWorkTimePercentage * 60) +
          minimumWorkTimeInMinutes
      );
    });
    return sample;
  }
  generateCodeReviewWorkIterationTime(maxTimeInHours = 0.5) {
    return this.sampleCodeReviewWorkIterationTime(1)[0];
  }
  sampleCodeReviewWorkIterationTime(sampleCount) {
    // Very similar to sampleWorkIterationTime, except this doesn't have a minimum of
    // at least 30 minutes of work.
    if (sampleCount <= 0) {
      return [];
    }
    const sample = PD.rgamma(sampleCount, 3, 0.1).map((maxWorkTimeValue) => {
      const maxWorkTimePercentage = Math.min(maxWorkTimeValue / 100.0, 1);
      return new WorkIteration(
        Math.round(this.maxCodeReviewTimeInHours * maxWorkTimePercentage * 60)
      );
    });
    return sample;
  }

  generateQaAutomationWorkIteration() {
    return this.sampleQaAutomationIterationTime(1)[0];
  }
  sampleQaAutomationIterationTime(sampleCount) {
    // The probability curve is flipped around for this, as QA automation is often
    // beholden to the current implementation that the programmers put in place. So not
    // only would they have to figure out what the programmers left them to work with,
    // but they would also have to engineer likely complex solutions for things like
    // explicit waits. Debugging while they develop can also take much longer as they
    // are likely writing the tests at a higher level, where things are, by
    // definition, more complex.
    //
    // In other words, while other tasks are more likely to trend towards the lower
    // end of their respective possible durations, QA automation is more likely to
    // trend towards the higher end, as it is incredibly unlikely that a QA automation
    // task would take less time.
    if (sampleCount <= 0) {
      return [];
    }
    const minimumWorkTimeInMinutes = 30;
    const sample = PD.rgamma(1, 3, 0.1).map((workTimeValue) => {
      const workTimePercentage = Math.max(
        (workTimeValue / 100.0 - 1.0) * -1,
        0
      );
      return new WorkIteration(
        Math.round(this.maxQaAutomationTime * workTimePercentage * 60) +
          minimumWorkTimeInMinutes
      );
    });
    return sample;
  }
  generateTicketPassBackCount() {
    return this.sampleTicketPassBackCount(1)[0];
  }
  sampleTicketPassBackCount(sampleCount) {
    // return Math.floor(PD.rchisq(1, 1, 5)[0]);
    return PD.rpois(sampleCount, this.averagePassBackCount);
  }
}

class StackLogEntry {
  constructor(
    dayTimeRangeStart,
    dayTimeRangeEnd,
    activeDevelopment,
    waitingForCodeReview,
    inCodeReview,
    waitingForQa,
    inQa,
    beingAutomated,
    sentBack,
    done,
    waitingForAutomation,
    automated
  ) {
    this.dayTimeRangeStart = dayTimeRangeStart;
    this.dayTimeRangeEnd = dayTimeRangeEnd;
    this.activeDevelopment = activeDevelopment;
    this.waitingForCodeReview = waitingForCodeReview;
    this.inCodeReview = inCodeReview;
    this.waitingForQa = waitingForQa;
    this.inQa = inQa;
    this.beingAutomated = beingAutomated;
    this.sentBack = sentBack;
    this.done = done;
    this.waitingForAutomation = waitingForAutomation;
    this.automated = automated;
  }
}

export class Simulation {
  constructor({
    sprintDayCount = 10,
    regressionTestDayCount = 2,
    dayStartTime = 10,
    programmerCount = 5,
    testerCount = 1,
    maxInitialProgrammerWorkTimeInHours = 16,
    maxFullRunTesterWorkTimeInHours = 8,
    maxQaAutomationTime = 8,
    averagePassBackCount = 1,
    customEventsByDay = null,
  }) {
    this.dayLengthInMinutes = 480;
    this.dayStartHour = 10;
    this.dayStartTime = dayStartTime;
    this.lunchTime = (12 - this.dayStartTime) * 60;
    this.sprintDayCount = sprintDayCount;
    this.regressionTestDayCount = regressionTestDayCount;
    this.totalDays = this.sprintDayCount + this.regressionTestDayCount;
    this.totalSprintMinutes = sprintDayCount * this.dayLengthInMinutes;
    this.totalSimulationMinutes =
      this.totalSprintMinutes +
      regressionTestDayCount * this.dayLengthInMinutes;
    this.simulationEndDay = this.totalDays;
    this.simulationEndTime = this.dayLengthInMinutes;
    this.simulationEndDayTime = this.dayTimeFromDayAndTime(
      this.simulationEndDay,
      this.simulationEndTime
    );
    // The amount of minutes from the previous days of regression testing. The
    // simulation starts at the first day of regression tests from the prior sprint,
    // so this is used to get the dayTime of events relative to the full sprint.
    this.dayTimeAdjustment = regressionTestDayCount * this.dayLengthInMinutes;
    this.programmerCount = programmerCount;
    this.testerCount = testerCount;
    this.maxInitialProgrammerWorkTimeInHours = maxInitialProgrammerWorkTimeInHours;
    this.maxFullRunTesterWorkTimeInHours = maxFullRunTesterWorkTimeInHours;
    this.maxQaAutomationTime = maxQaAutomationTime;
    this.averagePassBackCount = averagePassBackCount;
    if (customEventsByDay === null) {
      // One array for each worker, each containing one array for each day of the sprint
      customEventsByDay = [
        ...Array(programmerCount + testerCount).keys(),
      ].map(() => [...Array(this.totalDays).keys()].map(() => []));
    }
    this.prepareWorkers(customEventsByDay);
    this.ticketFactory = new TicketFactory(
      this.maxInitialProgrammerWorkTimeInHours,
      this.maxFullRunTesterWorkTimeInHours,
      this.maxQaAutomationTime,
      this.averagePassBackCount
    );
    this.tickets = [];
    this.sprintTickets = [];
    this.qaStack = [];
    this.automationStack = [];
    this.automatedStack = [];
    this.passBackStack = [];
    this.doneStack = [];
    this.unfinishedStack = [];
    this.codeReviewStack = [];
    this.stackTimelineHashMap = [];
    this.stackTimelineSets = [];
    this.simulate();
    this.aggregateMinutesSpent();
  }
  prepareWorkers(customEventsByDay) {
    this.programmers = [];
    for (let i = 0; i < this.programmerCount; i++) {
      let prog = new Programmer(
        this.sprintDayCount,
        this.regressionTestDayCount,
        this.lunchTime,
        customEventsByDay.shift()
      );
      prog.name = `${Programmer.name} #${i + 1}`;
      prog.color =
        workerIdentifierColors[i % (workerIdentifierColors.length - 1)];
      this.programmers.push(prog);
    }
    this.testers = [];
    for (
      let i = this.programmerCount;
      i < this.testerCount + this.programmerCount;
      i++
    ) {
      let t = new Tester(
        this.sprintDayCount,
        this.regressionTestDayCount,
        this.lunchTime,
        customEventsByDay.shift()
      );
      t.name = `${Tester.name} #${i + 1 - this.programmerCount}`;
      t.color = workerIdentifierColors[i % (workerIdentifierColors.length - 1)];
      this.testers.push(t);
    }
    this.workers = [...this.programmers, ...this.testers];
  }
  simulate() {
    this.currentDay = 0;
    this.currentTime = 0;
    this.currentDayTime = 0;
    let checkInTime = this.getNextCheckInTime();
    this.currentDay = Math.floor(checkInTime / this.dayLengthInMinutes);
    this.currentTime = checkInTime % this.dayLengthInMinutes;
    this.currentDayTime = this.dayTimeFromDayAndTime(
      this.currentDay,
      this.currentTime
    );
    this.previousDay = null;
    this.previousTime = null;
    this.previousDayTime = null;
    while (
      this.currentDayTime <= this.simulationEndDayTime &&
      this.currentDayTime >= 0
    ) {
      // process potentially completed work first
      if (
        this.getNextCheckInTime() > 0 &&
        this.getNextCheckInTime() < this.currentDayTime
      ) {
        throw new Error();
      }
      this.processProgrammerCompletedWork();
      this.processTesterCompletedWork();
      if (
        this.getNextCheckInTime() > 0 &&
        this.getNextCheckInTime() < this.currentDayTime
      ) {
        throw new Error();
      }

      // process handing out new work after all available tickets have been
      // determined
      this.handOutNewProgrammerWork();
      this.backfillTesterScheduleForTimeTheySpentDoingNothing();
      this.handOutNewTesterWork();
      if (
        this.getNextCheckInTime() > 0 &&
        this.getNextCheckInTime() < this.currentDayTime
      ) {
        throw new Error();
      }
      this.nextCheckInTime = this.getNextCheckInTime();
      if (this.nextCheckInTime === this.currentDayTime) {
        throw Error("DayTime would not progress");
      }
      this.previousDay = this.currentDay;
      this.previousTime = this.currentTime;
      this.previousDayTime = this.currentDayTime;
      this.currentDay = Math.floor(
        this.nextCheckInTime / this.dayLengthInMinutes
      );
      this.currentTime = this.nextCheckInTime % this.dayLengthInMinutes;
      this.currentDayTime = this.dayTimeFromDayAndTime(
        this.currentDay,
        this.currentTime
      );
      let logEndTime = this.currentDayTime;

      if (this.nextCheckInTime < 0) {
        // no more check-ins for this sprint, so set both values to -1 to exit the
        // loop. Add stack log entries from this time to the end of the sprint
        // because whatever the stacks are now will be what they are at the end of
        // the sprint.

        // set log end time to the last minute of the simulated time, so it
        // isn't a negative number
        logEndTime = this.simulationEndDayTime;
      }
      this.generateStackLogEntriesForDayTimeRange(
        this.previousDayTime,
        logEndTime
      );
    }
    this.unfinishedStack.concat([...this.qaStack, ...this.passBackStack]);
  }
  dayTimeFromDayAndTime(day, time) {
    // given a day and a time, return the dayTime
    return day * this.dayLengthInMinutes + time;
  }
  generateStackLogEntriesForDayTimeRange(dayTimeRangeStart, dayTimeRangeEnd) {
    // take the stacks at the moment of this function being called, and create a
    // series of stack log entries for each minute in the given dayTime range
    let activeDevelopment = this.getTicketsCurrentlyInActiveDevelopment();
    let waitingForCodeReview = this.codeReviewStack.slice();
    let inCodeReview = this.getTicketsCurrentlyInCodeReview();
    let waitingForQa = this.qaStack.slice();
    let waitingForAutomation = this.automationStack.slice();
    let automated = this.automatedStack.slice();
    let inQa = this.getTicketsCurrentlyInQa();
    let beingAutomated = this.getTicketsCurrentlyBeingAutomated();
    let sentBack = this.passBackStack.slice();
    let done = this.doneStack.slice();
    let logEntry = new StackLogEntry(
      dayTimeRangeStart,
      dayTimeRangeEnd,
      activeDevelopment,
      waitingForCodeReview,
      inCodeReview,
      waitingForQa,
      inQa,
      beingAutomated,
      sentBack,
      done,
      waitingForAutomation,
      automated
    );
    for (let i = dayTimeRangeStart; i < dayTimeRangeEnd; i++) {
      this.stackTimelineHashMap.push(logEntry);
    }
    this.stackTimelineSets.push(logEntry);
  }
  getTicketsCurrentlyInActiveDevelopment() {
    // Iterates over the programmers and grabs all of the tickets that they're
    // working on. Tickets being code reviewed are not considered for this, as they
    // are tracked elsewhere.
    return [
      ...this.programmers.reduce((tickets, programmer) => {
        if (
          programmer.schedule.lastTicketWorkedOn &&
          programmer.schedule.lastTicketWorkedOn.programmerWorkIterations
            .length <
            programmer.schedule.lastTicketWorkedOn
              .programmerCodeReviewWorkIterations.length
        ) {
          tickets.push(programmer.schedule.lastTicketWorkedOn);
        }
        return tickets;
      }, []),
    ];
  }
  getTicketsCurrentlyInCodeReview() {
    return [
      ...this.programmers.reduce((tickets, programmer) => {
        if (
          programmer.schedule.lastTicketWorkedOn &&
          programmer.schedule.lastTicketWorkedOn.programmerWorkIterations
            .length ===
            programmer.schedule.lastTicketWorkedOn
              .programmerCodeReviewWorkIterations.length
        ) {
          tickets.push(programmer.schedule.lastTicketWorkedOn);
        }
        return tickets;
      }, []),
    ];
  }
  getTicketsCurrentlyInQa() {
    return [
      ...this.testers.reduce((tickets, tester) => {
        if (tester.schedule.lastTicketWorkedOn) {
          tickets.push(tester.schedule.lastTicketWorkedOn);
        }
        return tickets;
      }, []),
    ];
  }
  getTicketsCurrentlyBeingAutomated() {
    return [
      ...this.testers.reduce((tickets, tester) => {
        if (tester.schedule.lastTicketWorkedOn && tester.schedule.lastTicketWorkedOn.automationWorkIterations.length === 0) {
          tickets.push(tester.schedule.lastTicketWorkedOn);
        }
        return tickets;
      }, []),
    ];
  }
  getNextCheckInTime() {
    let earliestWorker = this.getWorkerWithEarliestUpcomingCheckIn();
    if (
      earliestWorker.nextWorkIterationCompletionCheckIn > this.currentDayTime
    ) {
      return earliestWorker.nextWorkIterationCompletionCheckIn;
    } else {
      return earliestWorker.nextAvailabilityCheckIn;
    }
  }
  getWorkerWithEarliestUpcomingCheckIn() {
    // Skip ahead to the next relevant point in time. This will either be the
    // next time a worker finishes an iteration of work for a ticket, or the
    // next time a worker is available for work. These are different times
    // because a worker can finish the iteration of work for a ticket, but then
    // have a meeting before they can begin work on another ticket. This is
    // important because if they didn't wait until after the meeting to grab the
    // next available ticket for them, another, more important ticket could
    // become available for them (e.g. a ticket that had to be sent back because
    // the tester found a problem, or a programmer sent a higher priority ticket
    // to QA).
    //
    // The current day and time are needed to rule out potential check-in points
    // that have already passed. If they are in the past, they must have already
    // been handled, or, in the case of the tester, they are waiting for work to
    // become available.
    return this.workers.reduce((eWorker, nWorker) => {
      // eWorker: Probable worker with earliest check-in
      // nWorker: The next worker in the iteration.
      // both workers have a check-in time this sprint, so determine which is earlier,
      // provided both have relevant check-ins coming up.
      if (eWorker.nextAvailabilityCheckIn <= this.currentDayTime) {
        // Both of the eWorker's check-ins are in the past, or were just performed.
        // Even if the next nWorker has no check-ins coming up, there will
        // eventually be an nWorker that does, because it would be impossible for
        // all workers to have check-ins in the past if not all had a -1 check-in.
        return nWorker;
      } else if (nWorker.nextAvailabilityCheckIn <= this.currentDayTime) {
        // If eWorker check-ins are not entirely in the past, but nWorker's are,
        // then eWorker moves because it's the only relevant worker in this
        // comparison.
        return eWorker;
      }
      if (
        eWorker.nextAvailabilityCheckIn <
        eWorker.nextWorkIterationCompletionCheckIn
      ) {
        throw new Error("No.");
      }
      // Both have check-ins coming up. Find each of their earliest upcoming check-ins
      // and compare them to determine which worker moves forward.
      // at least one of eWorker's check-ins would have to be coming up
      let eWorkerRelevantCheckIn;
      if (eWorker.nextWorkIterationCompletionCheckIn > this.currentDayTime) {
        // Worker has an upcoming work completion check-in. Work completion
        // check-ins must always come before, or be at the same time as availability
        // check-ins. If the completion check-in is earlier, then it must be the
        // one we want. If it's at the same time as the availability check-in, then
        // it doesn't matter which we use, so the logic is simpler if we defer to
        // the completion check-in.
        eWorkerRelevantCheckIn = eWorker.nextWorkIterationCompletionCheckIn;
      } else {
        // The work completion check-in must have been in the past, leaving the
        // availability check-in as the only upcoming check-in for this worker.
        eWorkerRelevantCheckIn = eWorker.nextAvailabilityCheckIn;
      }
      let nWorkerRelevantCheckIn;
      if (nWorker.nextWorkIterationCompletionCheckIn > this.currentDayTime) {
        // Worker has an upcoming work completion check-in. Work completion
        // check-ins must always come before, or be at the same time as availability
        // check-ins. If the completion check-in is earlier, then it must be the
        // one we want. If it's at the same time as the availability check-in, then
        // it doesn't matter which we use, so the logic is simpler if we defer to
        // the completion check-in.
        nWorkerRelevantCheckIn = nWorker.nextWorkIterationCompletionCheckIn;
      } else {
        // The work completion check-in must have been in the past, leaving the
        // availability check-in as the only upcoming check-in for this worker.
        nWorkerRelevantCheckIn = nWorker.nextAvailabilityCheckIn;
      }
      return eWorkerRelevantCheckIn > nWorkerRelevantCheckIn
        ? nWorker
        : eWorker;
    });
  }
  processProgrammerCompletedWork() {
    for (let p of this.programmers) {
      if (p.nextWorkIterationCompletionCheckIn !== this.currentDayTime) {
        continue;
      }
      let possiblyFinishedTicket = p.schedule.lastTicketWorkedOn;
      p.schedule.lastTicketWorkedOn = null;
      if (possiblyFinishedTicket.needsCodeReview) {
        this.codeReviewStack.push(possiblyFinishedTicket);
      } else {
        this.qaStack.push(possiblyFinishedTicket);
      }
    }
  }
  processTesterCompletedWork() {
    for (let t of this.testers) {
      if (t.nextWorkIterationCompletionCheckIn === this.currentDayTime) {
        let possiblyFinishedTicket = t.schedule.lastTicketWorkedOn;
        t.schedule.lastTicketWorkedOn = null;
        if (possiblyFinishedTicket.testerWorkIterations.length > 0) {
          // tester must have found a problem, so send it back to programmers
          this.passBackStack.push(possiblyFinishedTicket);
          possiblyFinishedTicket.firstIteration = false;
        } else if (!possiblyFinishedTicket.needsAutomation) {
          // automation was just completed
          this.automatedStack.push(possiblyFinishedTicket);
        }
          else {
          // no work iterations left, which means the tester didn't find any
          // issues
          // possiblyFinishedTicket.needsAutomation = true;
          this.doneStack.push(possiblyFinishedTicket);
          this.automationStack.push(possiblyFinishedTicket);
        }
      }
    }
  }
  handOutNewProgrammerWork() {
    // For every programmer, find the ones that are available for work.
    // For every one of those programmers, find the highest priority ticket in the
    // passBackStack that belongs to them (if any), and find the highest priority
    // ticket in the codeReviewStack that doesn't belong to them (if any). Of those
    // two tickets, determine which is the higher priority one, and have the
    // programmer work on that one. If they are the same priority, have the
    // programmer do the code review as that is holding back another programmer, and
    // it will take an hour or less to complete.
    //
    // If there are no existing tickets available for the programmer, then create a
    // new one to assign to them. This can be considered to be either already
    // planned work for the sprint, or work that was pulled into the sprint from the
    // backlog. Either way, a programmer should always have work available to do.
    for (let p of this.programmers) {
      if (
        p.nextAvailabilityCheckIn !== this.currentDayTime ||
        p.nextAvailabilityCheckIn < 0
      ) {
        continue;
      }
      // can start new work
      let ticket = null;
      if (this.passBackStack.length > 0 || this.codeReviewStack.length > 0) {
        let highestPriorityPassBackTicketIndex = this.getHighestPriorityPassBackWorkIndexForProgrammer(
          p
        );
        let highestPriorityCodeReviewTicketIndex = this.getHighestPriorityCodeReviewWorkIndexForProgrammer(
          p
        );
        if (
          highestPriorityPassBackTicketIndex !== null &&
          highestPriorityCodeReviewTicketIndex !== null
        ) {
          if (
            this.passBackStack[highestPriorityPassBackTicketIndex].priority <
            this.codeReviewStack[highestPriorityCodeReviewTicketIndex].priority
          ) {
            ticket = this.passBackStack.splice(
              highestPriorityPassBackTicketIndex,
              1
            )[0];
          } else {
            ticket = this.codeReviewStack.splice(
              highestPriorityCodeReviewTicketIndex,
              1
            )[0];
          }
        } else if (highestPriorityPassBackTicketIndex !== null) {
          ticket = this.passBackStack.splice(
            highestPriorityPassBackTicketIndex,
            1
          )[0];
        } else if (highestPriorityCodeReviewTicketIndex !== null) {
          ticket = this.codeReviewStack.splice(
            highestPriorityCodeReviewTicketIndex,
            1
          )[0];
        }
      }
      if (ticket === null) {
        ticket = this.ticketFactory.generateTicket();
        ticket.workStartDayTime = this.currentDayTime;
        p.addTicket(ticket);
        this.tickets.push(ticket);
        if (this.currentDay < this.sprintDayCount) {
          this.sprintTickets.push(ticket);
        }
      }
      try {
        p.schedule.addWork(ticket);
      } catch (err) {
        if (err instanceof RangeError) {
          // ran out of time in the sprint
          this.unfinishedStack.push(ticket);
        } else {
          throw err;
        }
      }
    }
  }
  getHighestPriorityPassBackWorkIndexForProgrammer(programmer) {
    let ownedTickets = programmer.tickets.map((ticket) => ticket.number);
    // needs to get highest priority ticket that belongs to them
    return this.passBackStack.reduce(
      (highestPriorityOwnedTicketIndex, currentTicket, currentTicketIndex) => {
        if (ownedTickets.includes(currentTicket.number)) {
          if (!highestPriorityOwnedTicketIndex) {
            return currentTicketIndex;
          }
          if (
            currentTicket.priority <
            this.passBackStack[highestPriorityOwnedTicketIndex].priority
          ) {
            return currentTicketIndex;
          }
        }
        return highestPriorityOwnedTicketIndex;
      },
      null
    );
  }
  getHighestPriorityCodeReviewWorkIndexForProgrammer(
    programmer
  ) {
    let ownedTickets = programmer.tickets.map((ticket) => ticket.number);

    // needs to get highest priority ticket that doesn't belongs to them
    return this.codeReviewStack.reduce(
      (highestPriorityOwnedTicketIndex, currentTicket, currentTicketIndex) => {
        if (!ownedTickets.includes(currentTicket.number)) {
          if (!highestPriorityOwnedTicketIndex) {
            return currentTicketIndex;
          }
          if (
            currentTicket.priority <
            this.codeReviewStack[highestPriorityOwnedTicketIndex].priority
          ) {
            return currentTicketIndex;
          }
        }
        return highestPriorityOwnedTicketIndex;
      },
      null
    );
  }
  getHighestPriorityAutomationIndex() {
    return this.automationStack.reduce(
      (highestPriorityTicketIndex, currentTicket, currentTicketIndex) => {
        if (!highestPriorityTicketIndex) {
          return currentTicketIndex;
        }
        if (
          currentTicket.priority <
          this.automationStack[highestPriorityTicketIndex].priority
        ) {
          return currentTicketIndex;
        }
        return highestPriorityTicketIndex;
      },
      null
    );
  }
  handOutNewTesterWork() {
    for (let t of this.testers) {
      if (t.nextAvailabilityCheckIn < 0) {
        // can't accept new work
        continue;
      }
      if (t.nextAvailabilityCheckIn <= this.currentDayTime) {
        // can start new work
        let ticket;
        if (this.qaStack.length > 0) {
          let highestPriorityTicketIndex = this.getHighestPriorityTicketIndexForTester(
            t
          );
          ticket = this.qaStack.splice(highestPriorityTicketIndex, 1)[0];
          t.addTicket(ticket);
          try {
            t.schedule.addWork(ticket);
          } catch (err) {
            if (err instanceof RangeError) {
              // ran out of time in the sprint
              this.unfinishedStack.push(ticket);
            } else {
              throw err;
            }
          }
        } else if (this.automationStack.length > 0) {
          let highestPriorityTicketIndex = this.getHighestPriorityAutomationIndex();
          ticket = this.automationStack.splice(highestPriorityTicketIndex, 1)[0];
          t.addTicket(ticket);
          try {
            t.schedule.addWork(ticket);
          } catch (err) {
            if (err instanceof RangeError) {
              // ran out of time in the sprint
              this.automationStack.push(ticket);
            } else {
              throw err;
            }
          }
        }
      }
    }
  }
  backfillTesterScheduleForTimeTheySpentDoingNothing() {
    // necessary to avoid logic issues towards the end of the sprint where next
    // available time is determined.
    for (let t of this.testers) {
      for (let daySchedule of t.schedule.daySchedules) {
        if (daySchedule.day > this.currentDay) {
          break;
        }
        for (let timeSlot of daySchedule.availableTimeSlots) {
          if (daySchedule.day === this.currentDay && timeSlot.startTime < this.currentTime && timeSlot.endTime >= this.currentTime) {
            // last slot that needs back-filling
            daySchedule.scheduleMeeting(new NothingEvent(timeSlot.startTime, this.currentTime - timeSlot.startTime, t, daySchedule.day));
            break;
          }
          daySchedule.scheduleMeeting(new NothingEvent(timeSlot.startTime, timeSlot.duration, t, daySchedule.day));
        }
      }
    }
    }
  getHighestPriorityTicketIndexForTester(tester) {
    let ownedTickets = tester.tickets.map((ticket) => ticket.number);
    return this.qaStack.reduce(
      (highestPriorityTicketIndex, currentTicket, currentTicketIndex) => {
        if (ownedTickets.includes(currentTicket.number)) {
          if (!highestPriorityTicketIndex) {
            return currentTicketIndex;
          }
          if (
            currentTicket.priority <
            this.qaStack[highestPriorityTicketIndex].priority
          ) {
            return currentTicketIndex;
          }
        }
        return highestPriorityTicketIndex;
      },
      null
    );
  }
  aggregateMinutesSpent() {
    // Example for getting time spent context switching at minute 321
    // worker 0: this.workerDataForDayTime[321].workers[0].contextSwitching
    // all together: this.workerDataForDayTime[321].cumulativeMinutes.contextSwitching
    this.workerDataForDayTime = [];

    for (let i = 0; i < this.totalSimulationMinutes; i++) {
      let dataForWorkersAtThisDayTime = [];
      for (let worker of this.workers) {
        let minutes = {
          meeting: worker.getMeetingMinutesAtDayTime(i),
          contextSwitching: worker.getContextSwitchingMinutesAtDayTime(i),
          productiveTicketWork: worker.getProductiveTicketWorkMinutesAtDayTime(
            i
          ),
          fixingTicketWork: worker.getProductiveTicketFixWorkMinutesAtDayTime(
            i
          ),
          codeReview: worker.getCodeReviewWorkMinutesAtDayTime(i),
          // recovery: worker.getProductivityRecoveryMinutesAtDayTime(i),
          checking: worker.getCheckingMinutesAtDayTime(i),
          regressionTesting: worker.getRegressionTestingMinutesAtDayTime(i),
          automation: worker.getAutomationMinutesAtDayTime(i),
          nothing: worker.getNothingMinutesAtDayTime(i),
        };
        dataForWorkersAtThisDayTime.push(minutes);
      }
      let cumulativeMinutesForDayTime = dataForWorkersAtThisDayTime.reduce(
        (acc, worker) => {
          let newAcc = {};
          for (let minuteName in worker) {
            newAcc[minuteName] = acc[minuteName] + worker[minuteName];
          }
          return newAcc;
        }
      );
      dataForWorkersAtThisDayTime["all"] = cumulativeMinutesForDayTime;

      this.workerDataForDayTime.push({
        workers: dataForWorkersAtThisDayTime,
        cumulativeMinutes: cumulativeMinutesForDayTime,
        logEntry: this.stackTimelineHashMap[i],
        prettyDayTime: this.getPrettyFormattedDayTime(i),
      });
    }
  }
  getPrettyFormattedDayTime(dayTime) {
    let day = parseInt(dayTime / this.dayLengthInMinutes) + 1;
    let hour =
      (parseInt(((dayTime % this.dayLengthInMinutes) + 1) / 60) +
        this.dayStartHour) %
        12 || 12;
    let minute = (dayTime + 1) % 60;
    return `Day ${day} ${hour}:${minute < 10 ? 0 : ""}${minute}`;
  }
}

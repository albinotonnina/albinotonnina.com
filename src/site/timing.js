const sceneTimes = {
  scene1: {
    offset: 0,
    duration: 900,
    menuoffset: 300,
  },
  scene2: {
    offset: 0,
    duration: 1100,
    menuoffset: 600,
  },
  scene3: {
    offset: 0,
    duration: 1100,
    menuoffset: 600,
  },

  scene4: {
    offset: 0,
    duration: 1000,
    menuoffset: 0,
  },

  scene5: {
    offset: 0,
    duration: 2100,
    menuoffset: 1470,
  },
  scene6: {
    offset: 0,
    duration: 2500,
    menuoffset: 1400,
  },
};

export default {
  get maxScroll() {
    return Object.values(sceneTimes).reduce(
      (acc, { duration }) => acc + parseInt(duration, 0),
      0
    );
  },

  get scenes() {
    let begin = 0;

    Object.keys(sceneTimes).forEach((scene) => {
      begin += sceneTimes[scene].offset;
      sceneTimes[scene].name = scene;
      sceneTimes[scene].begin = begin;
      sceneTimes[scene].end = begin + sceneTimes[scene].duration;
      begin += sceneTimes[scene].duration;
    });

    return sceneTimes;
  },
};

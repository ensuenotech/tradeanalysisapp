import moment from "moment";

export const predicateBy = (prop:any) => {
  return function (a:any, b:any) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
};
export function predicateByDesc(prop:any) {
  return function (a:any, b:any) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}
export function predicateNumberByDesc(prop:any) {
  return function (a:any, b:any) {
    // if (Number.isNaN(a[prop]) || Number.isNaN(b[prop])) return 0;
    if (Number(a[prop]) < Number(b[prop])) {
      return 1;
    } else if (Number(a[prop]) > Number(b[prop])) {
      return -1;
    }
    return 0;
  };
}
export function predicateNumberBy(prop:any) {
  return function (a:any, b:any) {
    if (Number(a[prop]) > Number(b[prop])) {
      return 1;
    } else if (Number(a[prop]) < Number(b[prop])) {
      return -1;
    }
    return 0;
  };
}

export const getUTC = () => {
  let currentTime = new Date(new Date().toUTCString());

  return new Date(
    currentTime.getTime() + currentTime.getTimezoneOffset() * 60000
  );
  // return new Date(new Date().toUTCString())
};
export const getIST = () => {
  let time = new Date();
  time = new Date(
    time.setTime(getUTC().getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)
  );
  return time;
};
export const getPreviousWorkingDate = (currentTime:any) => {
  let newDate = new Date(moment(currentTime).unix() * 1000);
  if (newDate.getDay() == 6) {
    currentTime.setDate(currentTime.getDate() - 1);
  } else if (newDate.getDay() == 0) {
    currentTime.setDate(currentTime.getDate() - 2);
  }

  return new Date(moment(currentTime).unix() * 1000);
};
export const getNextWorkingDate = (currentTime:any) => {
  let newDate = new Date(moment(currentTime).unix() * 1000);
  if (newDate.getDay() == 6) {
    currentTime.setDate(currentTime.getDate() + 2);
  } else if (newDate.getDay() == 0) {
    currentTime.setDate(currentTime.getDate() + 1);
  }

  return new Date(moment(currentTime).unix() * 1000);
};
export const onlyUnique = (value:any, index:any, self:any) => {
  return self.indexOf(value) === index;
};
// export const getToFrom = () => {
//     let from: Date = new Date();
//     let to: Date = new Date();
//     let currentTime = getIST()

//     if (currentTime.getDay() == 1 && currentTime.getHours() < 9 || (currentTime.getHours() == 9 && currentTime.getMinutes() < 15)) {
//         let _from = currentTime
//         from.setDate(_from.getDate() - 3)
//         to.setDate(_from.getDate() - 3)
//         to.setHours(15)
//         to.setMinutes(30)
//     }
//     else if (currentTime.getDay() == 6) {
//         let _from = currentTime
//         from.setDate(_from.getDate() - 1)
//         to.setDate(_from.getDate() - 1)
//         to.setHours(15)
//         to.setMinutes(30)
//     }
//     else if (currentTime.getDay() == 0) {
//         let _from = currentTime
//         from.setDate(_from.getDate() - 2)
//         to.setDate(_from.getDate() - 2)
//         to.setHours(15)
//         to.setMinutes(30)
//     }
//     else {
//         if (getIST().getHours() < 9 || (getIST().getHours() == 9 && getIST().getMinutes() < 15)) {
//             from.setDate(getIST().getDate() - 1)
//             to.setDate(getIST().getDate() - 1)
//             to.setHours(15)
//             to.setMinutes(30)
//         }
//         else {
//             from = getIST()
//             to = getIST()
//         }

//     }
//     from.setHours(9)
//     from.setMinutes(15)
//     to.setHours(15)
//     to.setMinutes(30)
//     return { from: from, to: to }
// }
export const useAPI = () => {
  return false;
};

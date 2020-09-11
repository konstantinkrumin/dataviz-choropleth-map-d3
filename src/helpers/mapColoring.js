// mapColoring maps a specified color to the relevant group
const mapColoring = (countyEdLvl, colorPalette, groupsArr) => {
  if (countyEdLvl > groupsArr[0] && countyEdLvl <= groupsArr[1]) {
    return colorPalette[1];
  } else if (countyEdLvl > groupsArr[1] && countyEdLvl <= groupsArr[2]) {
    return colorPalette[2];
  } else if (countyEdLvl > groupsArr[2] && countyEdLvl <= groupsArr[3]) {
    return colorPalette[3];
  } else if (countyEdLvl > groupsArr[3] && countyEdLvl <= groupsArr[4]) {
    return colorPalette[4];
  } else if (countyEdLvl > groupsArr[4] && countyEdLvl <= groupsArr[5]) {
    return colorPalette[5];
  } else if (countyEdLvl > groupsArr[5] && countyEdLvl <= groupsArr[6]) {
    return colorPalette[6];
  } else if (countyEdLvl > groupsArr[6] && countyEdLvl <= groupsArr[7]) {
    return colorPalette[7];
  } else {
    return colorPalette[0];
  }
};

export { mapColoring };

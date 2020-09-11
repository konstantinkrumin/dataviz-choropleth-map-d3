/* createEducationGroupsArr is a helper function used to create groups based 
on education level */
const createEducationGroupsArr = (
  minEducationLevel,
  numOfSections,
  section
) => {
  const groupsArr = [minEducationLevel];
  let temp = minEducationLevel;
  for (let i = 0; i < numOfSections - 1; i++) {
    temp += section;
    groupsArr.push(Math.round(temp));
  }
  return groupsArr;
};

export { createEducationGroupsArr };

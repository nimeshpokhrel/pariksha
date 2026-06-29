const convertDate = (date) => {
  const localCreatedAt = new Date(date);
  const localDay = String(localCreatedAt.getDate()).padStart(2, "0");
  const localMonth = String(localCreatedAt.getMonth() + 1).padStart(2, "0");

  const localFormattedDate = `${localDay}/${localMonth}`;
  return localFormattedDate;
};

export default convertDate;

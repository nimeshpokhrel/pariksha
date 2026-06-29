import parse from "html-react-parser";

const HtmlContent = ({ children }) => {
  if (typeof children !== "string") return null;
  return parse(children);
};

export default HtmlContent;

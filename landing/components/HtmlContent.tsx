import parse from "html-react-parser";

const HtmlContent = ({ html }: { html: string }) => <>{parse(html)}</>;

export default HtmlContent;

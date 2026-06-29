import Navbar from "@/components/Navbar";

export async function generateMetadata() {
  return {
    title: `FREE CSIT ENTRANCE PREPARATION - PARIKSHA`,
  };
}

function Layout({ children }) {
  return (
    <>
      <div className=" ">{children}</div>
    </>
  );
}

export default Layout;

import { Link } from "react-router-dom";

export const Navbar = () => {
 return (
  <>
   <div className="shadow-md py-3 fixed w-full">
    <div className="w-full">
     <div className="mx-20">
      <Link to="/">
       <h1 className="text-blue-500 font-bold">SimpliChat</h1>
      </Link>
     </div>
    </div>
   </div>
  </>
 );
};

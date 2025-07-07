import Home from "../pages/Home";
import Utils from "../pages/Utils";
import Session21 from "../pages/Session21";
import Session22 from "../pages/Session22";
import Session23 from "../pages/Session23";
import Grandprize from "../pages/GrandPrize";
import ImportGuests from "../utils/testReadExcel";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const routeList = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/ses21",
        element: <Session21 />,
    },
    {
        path: "/ses22",
        element: <Session22 />,
    },
    {
        path: "/ses23",
        element: <Session23 />,
    },
    {
        path: "/grandprize",
        element: <Grandprize />,
    },
    {
        path: "/import",
        element: <ImportGuests />,
    },
    {
        path: "/utils",
        element: <Utils />,
    },
]);

const Routes = () => {
    return <RouterProvider router={routeList} />;
};

export default Routes;

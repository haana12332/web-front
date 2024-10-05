import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { router } from "@/routes";

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;

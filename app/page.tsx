import ClientSDK from "@/components/pages/home/client/ClientSDK";
import ServerSDK from "@/components/pages/home/server/ServerSDK";

const page = () => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x overflow-hidden">
      <section className="bg-primary/5 p-4 lg:p-6 overflow-y-auto">
        <ClientSDK />
      </section>
      <section className="bg-secondary/5 p-4 lg:p-6 overflow-y-auto border-secondary/10">
        <ServerSDK />
      </section>
    </div>
  );
};

export default page;

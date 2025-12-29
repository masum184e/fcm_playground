import React from "react";

const page = () => {
  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x overflow-hidden">
      {/* Client SDK Column */}
      <section className="bg-primary/5 p-4 lg:p-6 overflow-y-auto">
        {/* <ClientColumn onTokenGenerated={setSharedToken} /> */}
      </section>

      {/* Admin SDK Column */}
      <section className="bg-secondary/5 p-4 lg:p-6 overflow-y-auto border-secondary/10">
        {/* <AdminColumn initialToken={sharedToken} /> */}
      </section>
    </div>
  );
};

export default page;

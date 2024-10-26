"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Attributes } from "./_components/Attributes";
import { Categories } from "./_components/Categories";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-secondary-foreground">
        Dashboard
      </h1>
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="attributes">
          <Attributes />
        </TabsContent>
        <TabsContent value="categories">
          <Categories />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import AdminForm from "@/components/forms/AdminForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="state">Add State</TabsTrigger>
          <TabsTrigger value="topic">Add Topic</TabsTrigger>
        </TabsList>

        <TabsContent value="state" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create New State</h2>
            <AdminForm type="state" />
          </div>
        </TabsContent>

        <TabsContent value="topic" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Topic</h2>
            <AdminForm type="topic" />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

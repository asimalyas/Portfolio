import React from "react";
import { Link } from "react-router-dom";
import { adminCollections } from "@/lib/admin-config";

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Add, edit, delete, and publish portfolio content from one secure place.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/admin/profile"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-indigo-500/50"
        >
          <h2 className="text-lg font-semibold">Profile & About</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Update name, hero text, about copy, resume, contact, links, and AI shortcuts.
          </p>
        </Link>

        {adminCollections.map((collection) => (
          <Link
            key={collection.slug}
            to={`/admin/${collection.slug}`}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-indigo-500/50"
          >
            <h2 className="text-lg font-semibold">{collection.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

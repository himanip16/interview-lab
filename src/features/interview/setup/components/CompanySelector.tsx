"use client";

import { useEffect, useState } from "react";
import { Select } from "@/src/components/ui/Select";

type Company = {
  id: string;
  name: string;
  problemCount: number;
  totalFrequency: number;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CompanySelector({
  value,
  onChange,
}: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        setCompanies(data.companies || []);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Company (Optional)
      </h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading companies...</p>
      ) : (
        <div>
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Any Company</option>
            {companies.map((company) => (
              <option
                key={company.id}
                value={company.name}
              >
                {company.name} ({company.problemCount} problems)
              </option>
            ))}
          </Select>
          <p className="mt-2 text-xs text-muted-foreground">
            Filter problems by company to practice with specific interview styles.
          </p>
        </div>
      )}
    </div>
  );
}
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SchoolFilters() {
  const search = useSearch({ from: "/(app)/dashboard/admin/schools" })
  const [searchTerm, setSearchTerm] = useState(search.search || "")
  const navigate = useNavigate({ from: "/dashboard/admin/schools" })

  useEffect(() => {
    setSearchTerm(search.search || "")
  }, [search.search])

  const handleSearch = () => {
    navigate({
      search: {
        ...search,
        search: searchTerm || undefined,
        page: 1,
      },
    })
  }

  const handleClear = () => {
    setSearchTerm("")
    navigate({
      search: {
        ...search,
        search: undefined,
        page: 1,
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar escolas..."
          className="pl-8 pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Limpar busca</span>
          </button>
        )}
      </div>
      <Button onClick={handleSearch}>Buscar</Button>
    </div>
  )
}

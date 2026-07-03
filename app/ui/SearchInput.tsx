import { Search } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupDemo() {
  return (
    <InputGroup className="max-w-[240px] hidden lg:flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/30">
      <InputGroupInput placeholder="Rechercher..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  )
}

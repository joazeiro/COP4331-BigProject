import Account from "@/components/Account"
import AccountContainer from "@/components/AccountContainer"
import AccountNavbar from '@/components/AccountNavbar'
import { SearchHandler } from '@/components/SearchContext'

export default function AccountPage() {
  return (
    <SearchHandler>
      <AccountNavbar/>
        <AccountContainer>
          <Account/>  
        </AccountContainer>
    </SearchHandler>
  )
}
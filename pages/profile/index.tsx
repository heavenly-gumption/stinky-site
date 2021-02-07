import Link from 'next/link'
import Page from '../../components/scaffolding/page'
import SignOutButton from '../../components/sign-out-button'
import Allowable from '../../components/scaffolding/allowable'
import { isAdminRole, isDefaultRole } from '../../utils/roles'

export default function ProfileIndex() {
    return (
      <Page
        isAllowedWithRoles={isDefaultRole}
        page={
          <>
            <h1>Protected Page haha</h1>
            <p>You can view this page because you are signed in.</p>
            <SignOutButton/>
            <Allowable
              isAllowedWithRoles={isAdminRole}
              componentIfAllowed={
                <Link
                  href="/admin"
                >
                  <a>Admin Page Here</a>
                </Link>
              }
            />
          </>
        }
      />
    )
}
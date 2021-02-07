import Page from '../../components/scaffolding/page'
import { isAdminRole } from '../../utils/roles'

export default function AdminIndex() {
    return (
        <Page
            isAllowedWithRoles={isAdminRole}
            page={
                <>
                    Hello I am Admin
                </>
            }
        />
    )
}
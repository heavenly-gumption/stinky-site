import { useEffect, useState } from 'react'
import useSWR from 'swr'
import Page from '../../components/scaffolding/page'
import Table from '../../components/table'
import { DocumentModel, User } from '../../types/models'
import { isAdminRole } from '../../utils/roles'

function fetcher(url, options) {
    return fetch(url, options)
    .then(res => res.json())
}

export default function AdminIndex() {
    
    const { data, error } = useSWR('/api/users', fetcher)
    if (error) return <div>failed to load</div>
    if (!data) return <div>loading...</div>

    console.log(data)
    return (
        <Page
            isAllowedWithRoles={isAdminRole}
            page={
                <>
                    Hello I am Admin
                    <Table<DocumentModel<User>>
                        order={[
                            'id',
                            'email',
                            'name',
                            'roles'
                        ]}
                        data={data.users as DocumentModel<User>[]}
                        getId={user => user.id}
                    />
                </>
            }
        />
    )
}

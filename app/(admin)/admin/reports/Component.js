'use client'

import Accidents from "../accidents/Component";

export default function Reports() {

    /*    useEffect(() => {
           updateSharedData({ pageTitle: 'Thefts' })
       }, [])
    */

    return <Accidents pageName={'Reports'} headings={['S/N', 'Date', 'Plate Number', 'Location', 'Casualties', 'Degree',
        'Details', 'Category', 'Report Type', 'Delete', 'Edit']} hideAddButton={true} />
} 
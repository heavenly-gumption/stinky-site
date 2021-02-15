import { useState, useMemo } from 'react'

export enum SortingDirection {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}

export type ComparatorResult = -1 | 0 | 1

export type Comparators<M> = Partial<{
    [P in keyof M]: (a: M[P], b: M[P]) => ComparatorResult
}>

export type SortableDataOptions<M> = {
    sortKey: keyof M
    sortingDirection: SortingDirection
}

export function useSortableData<M>(
    data: M[],
    initialSortOptions: Partial<SortableDataOptions<M>>,
    comparators: Comparators<M>
): [
    M[],
    Partial<SortableDataOptions<M>>,
    (sortKey: keyof M) => void
] {
    const [sortOptions, setSortOptions] = useState(initialSortOptions)
    const sortedData = useMemo(() => {
        const sortableData = [...data]
        const {
            sortKey,
            sortingDirection
        } = sortOptions
        if (sortKey) {
            const sortFunction = getSortFunction(comparators, sortKey, sortingDirection)
            sortableData.sort(sortFunction)
        }
        return sortableData
    }, [data, sortOptions])

    const sortBy = (sortKey: keyof M) => {
        const isSameKey = sortOptions
            && sortOptions.sortKey === sortKey
            && sortOptions.sortingDirection === SortingDirection.ASCENDING
        const sortingDirection = isSameKey
            ? SortingDirection.DESCENDING
            : SortingDirection.ASCENDING
        setSortOptions({
            sortKey,
            sortingDirection
        })
        console.log({
            sortKey,
            sortingDirection,
            sortOptions
        })
    }

    return [
        sortedData,
        sortOptions,
        sortBy
    ]
}

function getSortFunction<M>(
    comparators: Comparators<M>,
    key: keyof M,
    direction: SortingDirection
) {
    return (a: M, b: M) => {
        const comparator = comparators[key] ?? defaultComparator
        const result = comparator(a[key], b[key])
        const directedResult = directResult(result, direction)

        console.log({
            key,
            a: a[key],
            b: b[key],
            direction,
            result,
            directedResult
        })
        return directedResult
        
    }
}

function defaultComparator<T>(a: T, b: T): ComparatorResult {
    if (a < b) {
        return -1
    }
    if (a > b) {
        return 1
    }
    return 0
}

function directResult(
    result: ComparatorResult,
    direction: SortingDirection
): ComparatorResult {
    if (direction === SortingDirection.DESCENDING) {
        if (result === -1)
            return 1
        if (result === 1)
            return -1
        return 0
    }
    return result
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace vega.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> ApplyOrdering<T>(
            this IQueryable<T> query,
         IQueryObject queryObj,
        Dictionary<string, Expression<Func<T, object>>> columnsMap)
        {
            if (!string.IsNullOrWhiteSpace(queryObj?.SortBy) && columnsMap.TryGetValue(queryObj.SortBy, out var exp))
                query = queryObj.IsSortAscending ? query.OrderBy(exp) : query.OrderByDescending(exp);
            return query;
        }

    }
}
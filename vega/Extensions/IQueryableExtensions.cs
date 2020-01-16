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

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObj)
        {
            if (queryObj == null)
                return query;
            if (queryObj.PageSize <= 0)
                queryObj.PageSize = 10;
            if (queryObj.Page <= 0)
                queryObj.Page = 1;
            return query.Skip((queryObj.Page - 1) * queryObj.PageSize).Take(queryObj.PageSize);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DAL;
using NHibernate;
using NHibernate.Transform;

namespace Tools
{
    /// <summary>
    /// 通过Nhibenate执行Sql语句工具类
    /// </summary>
    public class ExecSqlHelp
    {
        /// <summary>
        ///  通过NHibernate的Parameter形式 执行Sql语句查询
        /// </summary>
        /// <typeparam name="T">泛型</typeparam>
        /// <param name="sql">sql语句</param>
        /// <param name="parameter">参数</param>
        /// <returns>泛型的集合</returns>
        public static List<T> ExecuteSql<T>(string sql, List<SqlParameter> parameter)
        {
            Type modelType = typeof(T);
            IQuery query = SessionFactory.GetCurrentSession().CreateSQLQuery(sql);//构造Sql
            if (parameter != null && parameter.Count > 0)
            {
                //循环添加参数
                foreach (var para in parameter)
                {
                    query.SetParameter(para.ParameterName, para.Value == null ? "" : para.Value);
                }
            }
            if (modelType.Name.ToLower() != "object")
            {
                var a = query.SetResultTransformer(Transformers.AliasToBean<T>()).List<T>();//映射为实体
                return a.ToList();
            }
            else
            {
                return query.List<T>().ToList();
            }
        }
        /// <summary>
        /// 通过NHibernate的Parameter形式 执行Sql语句查询
        /// </summary>
        /// <typeparam name="T">泛型</typeparam>
        /// <param name="sql">sql语句</param>
        /// <param name="swhere">条件语句</param>
        /// <param name="page">页数</param>
        /// <param name="limit">每页显示条数</param>
        /// <param name="sort">排序</param>
        /// <param name="count">返回查询的总条数</param>
        /// <param name="isNeedCount">是否需要返回查询总条数</param>
        /// <param name="countSql">查询sql 例如:count(oid),多表查询如count(a.oid)</param>
        /// <returns>泛型的集合</returns>
        public static List<T> ExecuteSql<T>(string sql, string swhere, int page, int limit, string sort, out int total, bool isNeedCount, string countSql)
        {
            #region 构造swhere语句和数据的参数
            StringBuilder whereSql = new StringBuilder();
            List<SqlParameter> parameters = new List<SqlParameter>();
            if (!string.IsNullOrEmpty(swhere))
            {
                CompareInfo Compare = CultureInfo.InvariantCulture.CompareInfo;//不区分大小写
                if (Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase) > 0)
                {
                    whereSql.Append(sql.Substring(Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase), sql.Length
                        - Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase)) + " AND ");
                    sql = sql.Substring(0, Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase));
                }
                else
                { whereSql.Append(" where "); }
                string[] wherePara = swhere.Split(',');
                for (int i = 0; i < wherePara.Length; i++)
                {
                    string[] para = wherePara[i].Split('|');
                    if (para.Length == 4)
                    {
                        if (para[3].ToLower() == "in")
                        {
                            whereSql.Append(" " + para[0] + " in " + Regex.Replace(para[2], ";", ",") + " and ");
                        }
                        else
                        {
                            whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + " and ");
                            parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                        }
                    }
                    else if (para.Length == 5)
                    {
                        if (para[4].ToLower() == "or")
                            whereSql.Append(" (" + para[0] + " " + para[3] + " :" + para[0] + "  " + para[4] + "  ");
                        else if (para[4].ToLower() == "endor")
                            whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + ")  and ");
                        else
                            whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + " " + para[4] + " ");
                        parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                    }
                    else
                    {
                        whereSql.Append(" " + para[0] + " like :" + para[0] + "  and ");
                        parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                    }
                }
            }
            if (whereSql.Length > 0)
            {
                whereSql.Remove(whereSql.Length - 5, 5);
            }
            #endregion
            #region 构造排序语句
            StringBuilder orderSql = new StringBuilder();
            if (!string.IsNullOrEmpty(sort))
            {
                orderSql.Append(" order by ");
                List<dynamic> orderList = Common.NewtonJsonHelper.Deserialize<List<dynamic>>(sort, null);
                foreach (dynamic item in orderList)
                {
                    if (Convert.ToString(item.direction).ToUpper() == "DESC")
                        orderSql.Append(" " + item.property + " DESC, ");
                    else
                        orderSql.Append(" " + item.property + " ASC, ");
                }
                if (orderSql.Length > 0)
                {
                    orderSql.Remove(orderSql.Length - 2, 2);
                }
            }
            #endregion
            #region 如果需要查询总数则查询总数
            total = 0;
            if (isNeedCount)
            {
                string totalSql = "SELECT " + countSql + " "
                    + sql.Substring(sql.ToLower().IndexOf("from"), sql.Length - sql.ToLower().IndexOf("from"));
                IQuery queryCount = SessionFactory.GetCurrentSession().CreateSQLQuery(totalSql + whereSql.ToString()).SetTimeout(180);//数据库连接过期时间60秒
                List<SqlParameter> wherePara = parameters.Where(t => t.UdtTypeName == "where").ToList();
                foreach (var para in wherePara)
                {
                    queryCount.SetParameter(para.ParameterName, para.Value);
                }
                total = Convert.ToInt32(queryCount.List<int>().FirstOrDefault());
                if (total == 0)
                {
                    return new List<T>();
                }
            }
            #endregion
            #region 执行查询sql
            IQuery query = SessionFactory.GetCurrentSession().CreateSQLQuery(sql + whereSql.ToString() + orderSql.ToString()).SetTimeout(180);//构造Sql，数据库连接过期时间60秒
            //循环添加参数
            foreach (var para in parameters)
            {
                query.SetParameter(para.ParameterName, para.Value);
            }
            if (typeof(T).Name.ToLower() == "object")
            {
                return query.SetFirstResult((page - 1) * limit).SetMaxResults(limit).List<T>().ToList();
            }
            else
            {
                return query.SetFirstResult((page - 1) * limit).SetMaxResults(limit)
                     .SetResultTransformer(Transformers.AliasToBean<T>()).List<T>().ToList();//映射为实体
            }
            #endregion
        }
        /// <summary>
        /// 通过NHibernate的Parameter形式 执行Sql语句查询 不分页导出
        /// </summary>
        /// <typeparam name="T">泛型</typeparam>
        /// <param name="sql">sql语句</param>
        /// <param name="swhere">条件语句</param>
        /// <param name="sort">排序</param>
        /// <param name="count">返回查询的总条数</param>
        /// <param name="isNeedCount">是否需要返回查询总条数</param>
        /// <param name="countSql">查询sql 例如:count(oid),多表查询如count(a.oid)</param>
        /// <returns>泛型的集合</returns>
        public static List<T> ExecuteSqlNoPage<T>(string sql, string swhere, string sort, out int total, bool isNeedCount, string countSql)
        {
            #region 构造swhere语句和数据的参数
            StringBuilder whereSql = new StringBuilder();
            List<SqlParameter> parameters = new List<SqlParameter>();
            if (!string.IsNullOrEmpty(swhere))
            {
                CompareInfo Compare = CultureInfo.InvariantCulture.CompareInfo;//不区分大小写
                if (Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase) > 0)
                {
                    whereSql.Append(sql.Substring(Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase), sql.Length
                        - Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase)) + " AND ");
                    sql = sql.Substring(0, Compare.IndexOf(sql, " where ", CompareOptions.IgnoreCase));
                }
                else
                { whereSql.Append(" where "); }
                string[] wherePara = swhere.Split(',');
                for (int i = 0; i < wherePara.Length; i++)
                {
                    string[] para = wherePara[i].Split('|');

                    if (para.Length == 4)
                    {
                        whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + " and ");
                        parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                    }
                    else if (para.Length == 5)
                    {
                        if (para[4].ToLower() == "or")
                            whereSql.Append(" (" + para[0] + " " + para[3] + " :" + para[0] + "  " + para[4] + "  ");
                        else if (para[4].ToLower() == "endor")
                            whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + ")  and ");
                        else
                            whereSql.Append(" " + para[0] + " " + para[3] + " :" + para[0] + " " + para[4] + " ");
                        parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                    }
                    else
                    {
                        whereSql.Append(" " + para[0] + " like :" + para[0] + "  and ");
                        parameters.Add(new SqlParameter() { ParameterName = para[0], Value = para[2], UdtTypeName = "where" });
                    }
                }
            }
            if (whereSql.Length > 0)
            {
                whereSql.Remove(whereSql.Length - 5, 5);
            }
            #endregion
            #region 构造排序语句
            StringBuilder orderSql = new StringBuilder();
            if (!string.IsNullOrEmpty(sort))
            {
                orderSql.Append(" order by ");
                List<dynamic> orderList = Common.NewtonJsonHelper.Deserialize<List<dynamic>>(sort, null);
                foreach (dynamic item in orderList)
                {
                    if (Convert.ToString(item.direction).ToUpper() == "DESC")
                        orderSql.Append(" " + item.property + " DESC, ");
                    else
                        orderSql.Append(" " + item.property + " ASC, ");
                }
                if (orderSql.Length > 0)
                {
                    orderSql.Remove(orderSql.Length - 2, 2);
                }
            }
            #endregion
            #region 如果需要查询总数则查询总数
            total = 0;
            if (isNeedCount)
            {
                string totalSql = "SELECT " + countSql + " "
                    + sql.Substring(sql.ToLower().IndexOf("from"), sql.Length - sql.ToLower().IndexOf("from"));
                IQuery queryCount = SessionFactory.GetCurrentSession().CreateSQLQuery(totalSql + whereSql.ToString()).SetTimeout(60);//数据库连接过期时间60秒
                List<SqlParameter> wherePara = parameters.Where(t => t.UdtTypeName == "where").ToList();
                foreach (var para in wherePara)
                {
                    queryCount.SetParameter(para.ParameterName, para.Value);
                }
                total = Convert.ToInt32(queryCount.List<int>().FirstOrDefault());
                if (total == 0)
                {
                    return new List<T>();
                }
            }
            #endregion
            #region 执行查询sql
            IQuery query = SessionFactory.GetCurrentSession().CreateSQLQuery(sql + whereSql.ToString() + orderSql.ToString()).SetTimeout(60);//构造Sql，数据库连接过期时间60秒
            //循环添加参数
            foreach (var para in parameters)
            {
                query.SetParameter(para.ParameterName, para.Value);
            }
            if (typeof(T).Name.ToLower() == "object")
            {
                return query.List<T>().ToList();
            }
            else
            {
                return query.SetResultTransformer(Transformers.AliasToBean<T>()).List<T>().ToList();//映射为实体
            }
            #endregion
        }
        /// <summary>
        /// 调用存储过程获取存储过程查到的DataSet
        /// </summary>
        /// <param name="execName">存储过程的名称</param>
        /// <param name="paraList">参数集合</param>
        /// <returns></returns>
        public static DataSet ExecuteDataset(List<SqlParameter> paraList, string execName)
        {
            using (SqlConnection myConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["RemoteSqlServer"].ConnectionString))
            {
                //myConnection.ConnectionTimeout = 0;
                // 在此处放置用户代码以初始化页面
                DataSet MyDataSet = new DataSet();
                System.Data.SqlClient.SqlDataAdapter DataAdapter = new System.Data.SqlClient.SqlDataAdapter();
                if (myConnection.State != ConnectionState.Open)
                {
                    myConnection.Open();
                }
                System.Data.SqlClient.SqlCommand myCommand = new System.Data.SqlClient.SqlCommand(execName, myConnection);
                myCommand.CommandType = CommandType.StoredProcedure;
                myCommand.CommandTimeout = 60;
                foreach (var para in paraList)
                {
                    myCommand.Parameters.Add(para.ParameterName, para.SqlDbType);
                    myCommand.Parameters[para.ParameterName].Value = para.Value;
                }

                myCommand.ExecuteNonQuery();
                DataAdapter.SelectCommand = myCommand;
                if (MyDataSet != null)
                {
                    DataAdapter.Fill(MyDataSet, "table");
                }
                //得到存储过程输出参数
                if (myConnection.State == ConnectionState.Open)
                {
                    myConnection.Close();
                }
                return MyDataSet;
            }
        }
    }
}

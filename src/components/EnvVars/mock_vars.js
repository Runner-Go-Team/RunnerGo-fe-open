export const MOCK_VARS = {
  base: {
    name: '基本',
    list: [
      {
        var: '@natural(1,100)',
        description: '返回一个随机的1-100的自然数（大于等于 0 的整数）',
      },
      {
        var: '@integer(1,100)',
        description: '返回随机的1-100的整数',
      },
      {
        var: '@float( 1, 10, 2, 5 )',
        description: '返回一个随机的浮点数，整数1-10，小数部分位数的最小值2，最大值5',
      },
      {
        var: '@character(pool)',
        description: '从字符串池返回随机的字符',
      },
      {
        var: '@string( pool, 1, 10 )',
        description: '从字符串池返回一个随机字符串，字符数1-10',
      },
      {
        var: '@range( 1, 100, 1 )',
        description: '返回一个整型数组，参数分别：start：起始值，stop：结束值，step：步长',
      },
    ],
  },
  date: {
    name: '日期',
    list: [
      {
        var: "@date('yyyy-MM-dd')",
        description: '返回一个随机的日期字符串。例：1983-01-29',
      },
      {
        var: "@time('HH:mm:ss')",
        description: '返回一个随机的时间字符串。 例：20:47:37',
      },
      {
        var: "@datetime('yyyy-MM-dd HH:mm:ss')",
        description: '返回一个随机的日期和时间字符串。例：1977-11-17 03:50:15',
      },
      {
        var: "@now('yyyy-MM-dd HH:mm:ss')",
        description: '返回当前日期字符串。例：2014-04-29 20:08:38',
      },
    ],
  },
  key: {
    name: '主键',
    list: [
      {
        var: '@guid()',
        description: '随机生成一个 GUID。例：eFD616Bd-e149-c98E-a041-5e12ED0C94Fd',
      },
      {
        var: '@increment(1)',
        description: '随机生成主键，从1起，整数自增的步长',
      },
    ],
  },
  web: {
    name: 'WEB',
    list: [
      {
        var: "@url('http')",
        description: '随机生成一个http URL',
      },
      {
        var: '@protocol()',
        description: '随机生成一个 URL 协议。例：http ftp',
      },
      {
        var: '@domain()',
        description: '随机生成一个域名',
      },
      {
        var: '@tld()',
        description: '随机生成一个顶级域名。例：net',
      },
      {
        var: '@email()',
        description: '随机生成一个邮件地址',
      },
      {
        var: '@ip()',
        description: '随机生成一个IP地址',
      },
    ],
  },
  area: {
    name: '地区',
    list: [
      {
        var: '@region()',
        description: '随机生成一个（中国）大区。例：华北',
      },
      {
        var: '@province()',
        description: '随机生成一个（中国）省（或直辖市、自治区、特别行政区）',
      },
      {
        var: '@city()',
        description: '随机生成一个（中国）市',
      },
      {
        var: '@county()',
        description: '随机生成一个（中国）县',
      },
      {
        var: '@county(true)',
        description: '随机生成一个（中国）县（带省市）。例：甘肃省 白银市 会宁县',
      },
    ],
  },
  zip: {
    name: '邮编',
    list: [
      {
        var: '@zip()',
        description: '随机生成一个邮政编码',
      },
    ],
  },
  name: {
    name: '人名',
    list: [
      {
        var: '@first()',
        description: '随机生成一个常见的英文名',
      },
      {
        var: '@last()',
        description: '随机生成一个常见的英文姓',
      },
      {
        var: '@name()',
        description: '随机生成一个常见的英文姓名',
      },
      {
        var: '@cfirst()',
        description: '随机生成一个常见的中文名',
      },
      {
        var: '@clast()',
        description: '随机生成一个常见的中文姓',
      },
      {
        var: '@cname()',
        description: '随机生成一个常见的中文姓名',
      },
    ],
  },
  color: {
    name: '颜色',
    list: [
      {
        var: '@color()',
        description: "随机生成颜色，格式为 '#RRGGBB'",
      },
      {
        var: '@rgb()',
        description: "随机生成颜色，格式为 'rgb(r, g, b)'",
      },
      {
        var: '@rgba()',
        description: "随机生成颜色，格式为 'rgba(r, g, b, a)'",
      },
      {
        var: '@hsl()',
        description: "随机生成颜色，格式为 'hsl(h, s, l)'",
      },
    ],
  },
  text: {
    name: '文本',
    list: [
      {
        var: '@paragraph()',
        description: '随机生成一段文本',
      },
      {
        var: '@cparagraph()',
        description: '随机生成一段中文文本',
      },
      {
        var: '@sentence()',
        description: '随机生成一个句子，第一个单词的首字母大写',
      },
      {
        var: '@csentence()',
        description: '随机生成一个中文句子',
      },
      {
        var: '@word()',
        description: '随机生成一个单词',
      },
      {
        var: '@cword()',
        description: '随机生成一个汉字',
      },
      {
        var: '@title()',
        description: '随机生成一个标题',
      },
      {
        var: '@ctitle()',
        description: '随机生成一个中文标题',
      },
    ],
  },
};

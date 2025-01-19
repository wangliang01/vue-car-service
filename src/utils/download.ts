import * as XLSX from 'xlsx';

interface DownloadExcelOptions {
  data: Record<string, any>[];
  headers: Array<{
    title: string;
    key: string;
  }>;
  fileName?: string;
}

export function downloadExcel(options: DownloadExcelOptions) {
  const { data, headers, fileName = 'export.xlsx' } = options;

  // 转换数据格式
  const excelData = data.map(item => {
    const row: Record<string, any> = {};
    headers.forEach(header => {
      row[header.title] = item[header.key];
    });
    return row;
  });

  // 创建工作簿
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData, {
    header: headers.map(h => h.title)
  });

  // 设置列宽
  const colWidth = headers.map(() => ({ wch: 15 }));
  ws['!cols'] = colWidth;

  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  // 下载文件
  XLSX.writeFile(wb, fileName);
} 
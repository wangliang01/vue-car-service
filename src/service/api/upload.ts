import { request } from '../request';

/** 上传文件接口返回数据类型 */
interface UploadResult {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

/** 
 * 上传单个文件
 * @param file - 要上传的文件
 * @param type - 文件类型(可选)，用于后端区分不同业务场景
 */
export function uploadFile(file: File, type?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (type) {
    formData.append('type', type);
  }0

  return request<UploadResult>({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
}

/** 
 * 批量上传文件
 * @param files - 要上传的文件数组
 * @param type - 文件类型(可选)
 */
export function uploadFiles(files: File[], type?: string) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  if (type) {
    formData.append('type', type);
  }

  return request<UploadResult[]>({
    url: '/upload/batch',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
}

/** 
 * 删除文件
 * @param fileId - 文件ID
 */
export function deleteFile(fileId: string) {
  return request({
    url: `/upload/${fileId}`,
    method: 'delete'
  });
} 
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const cloudinary = require('cloudinary').v2;

@Injectable()
export class FileUploader {
  constructor(private readonly configSvc: ConfigService) {}

  async mapFiles(files) {
    let fls = [];
    if (files && files.length > 0) {
      for await (let file of files) {
        fls.push({
          name: file.filename,
          type: file.filetype,
          uri:  await this._saveFile(
                file.base64Str,
                file.filename,
                file.filetype,
              ),
        });
      }
    }
    return fls;
  }

  async _saveFile(file, filename, fileType) {

    if(file.includes("res.cloudinary.com/dumjmbt0y")) return file
    cloudinary.config({
      cloud_name: this.configSvc.get<string>('cloudinary.name'),
      api_key: this.configSvc.get<string>('cloudinary.key'),
      api_secret: this.configSvc.get<string>('cloudinary.secret'),
    });

    const uri = await cloudinary.uploader.upload(file, { folder: 'dodavah' });

    return uri?.secure_url;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { IUserPayment } from './paystack.model';
const https = require('https');
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  constructor(private configService: ConfigService) {}

  public async makePayment(payment: IUserPayment): Promise<any> {
    const secret_key = this.configService.get<string>('paystack.key');

    const params = {
      ...payment,
      amount: parseInt(payment.amount) * 100,
      callback_url: 'http://localhost:3000/paystack/verify',
    };

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret_key}`,
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https
        .request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const response = JSON.parse(data);

            resolve({ ...response });
          });
        })
        .on('error', (error) => {
          reject(error);
        });
      req.write(JSON.stringify(params));
      req.end();
    });
  }

  public async verifyPayment(reference: String): Promise<any> {
    const secret_key = this.configService.get<string>('paystack.key');

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret_key}`,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https
        .request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const response = JSON.parse(data);

            resolve({ ...response });
          });
        })
        .on('error', (error) => {
          reject(error);
        });
      req.write(JSON.stringify({}));
      req.end();
    });
  }
}

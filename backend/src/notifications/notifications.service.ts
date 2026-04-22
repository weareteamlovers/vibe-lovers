import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type NewLetterAlertPayload = {
  letterId: string;
  senderName: string | null;
  title: string | null;
  body: string;
  isAnonymous: boolean;
  createdAt: Date;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendNewLetterAlert(payload: NewLetterAlertPayload): Promise<void> {
    const enabled =
      (this.configService.get<string>('LETTER_ALERT_ENABLED') ?? 'false').toLowerCase() === 'true';

    if (!enabled) {
      return;
    }

    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    const from = this.configService.get<string>('LETTER_ALERT_FROM_EMAIL');
    const to = this.configService.get<string>('LETTER_ALERT_TO_EMAIL');

    if (!apiKey || !from || !to) {
      this.logger.warn(
        '편지 알림 이메일 설정이 비어 있어 알림 전송을 건너뜁니다. RESEND_API_KEY / LETTER_ALERT_FROM_EMAIL / LETTER_ALERT_TO_EMAIL 을 확인하세요.'
      );
      return;
    }

    const senderLabel = payload.isAnonymous
      ? '익명'
      : payload.senderName?.trim() || '이름 미입력';

    const titleLabel = payload.title?.trim() || '(제목 없음)';
    const createdAtLabel = this.formatKoreanDate(payload.createdAt);

    const text = [
      '새 편지가 도착했습니다.',
      '',
      `편지 ID: ${payload.letterId}`,
      `작성 시각: ${createdAtLabel}`,
      `보낸 사람: ${senderLabel}`,
      `제목: ${titleLabel}`,
      '',
      '[본문]',
      payload.body
    ].join('\n');

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 16px;">새 편지가 도착했습니다</h2>
        <table style="border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 4px 12px 4px 0; font-weight: 700;">편지 ID</td>
            <td style="padding: 4px 0;">${this.escapeHtml(payload.letterId)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 12px 4px 0; font-weight: 700;">작성 시각</td>
            <td style="padding: 4px 0;">${this.escapeHtml(createdAtLabel)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 12px 4px 0; font-weight: 700;">보낸 사람</td>
            <td style="padding: 4px 0;">${this.escapeHtml(senderLabel)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 12px 4px 0; font-weight: 700;">제목</td>
            <td style="padding: 4px 0;">${this.escapeHtml(titleLabel)}</td>
          </tr>
        </table>

        <div style="font-weight: 700; margin-bottom: 8px;">본문</div>
        <div style="white-space: normal; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; background: #f9fafb;">
          ${this.escapeHtml(payload.body).replace(/\n/g, '<br />')}
        </div>
      </div>
    `;

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `[vibe-lovers] 새 편지 도착 - ${titleLabel}`,
          text,
          html
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`편지 알림 이메일 전송 실패: ${response.status} ${errorText}`);
        return;
      }

      const result = (await response.json()) as { id?: string };
      this.logger.log(`편지 알림 이메일 전송 완료: ${result.id ?? 'unknown-id'}`);
    } catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`편지 알림 이메일 전송 중 예외 발생: ${message}`);
    }
  }

  private formatKoreanDate(date: Date): string {
    return new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
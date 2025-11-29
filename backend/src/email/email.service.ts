import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

interface ProjectInviteTemplate {
  inviteLink: string;
  projectName: string;
  inviterEmail: string;
}

interface ReleaseUpdateTemplate {
  projectName: string;
  projectSlug: string;
  environment: string;
  version: string;
  branch: string;
  build: number;
  date: string;
  commitMessage: string | null;
  actorName: string;
  actorEmail: string;
  isNewRelease: boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter | null;

  constructor(private readonly configService: ConfigService) {
    this.transporter = this.createTransporter();
  }

  async sendProjectInvite(recipient: string, template: ProjectInviteTemplate) {
    if (!this.transporter) {
      this.logger.warn(
        `Email transport not configured. Invite for ${recipient}: ${template.inviteLink}`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: recipient,
        subject: `Invitation to collaborate on ${template.projectName}`,
        text: this.buildPlainText(template),
        html: this.buildHtml(template),
      });
    } catch (error) {
      this.logger.error(
        'Failed to send invite email',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async sendReleaseUpdateNotification(recipient: string, template: ReleaseUpdateTemplate) {
    if (!this.transporter) {
      this.logger.warn(
        `Email transport not configured. Release update for ${recipient} in ${template.projectSlug}`,
      );
      return;
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to: recipient,
        subject: this.buildReleaseSubject(template),
        text: this.buildReleasePlainText(template),
        html: this.buildReleaseHtml(template),
      });
    } catch (error) {
      this.logger.error(
        'Failed to send release update email',
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private createTransporter(): Transporter | null {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT'));

    if (!host || !port) {
      this.logger.warn('SMTP configuration missing. Emails will not be sent.');
      return null;
    }

    const secure =
      this.configService.get<string>('SMTP_SECURE') === 'true' || port === 465;

    const auth = {
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASSWORD'),
    };

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });
  }

  private buildPlainText({ projectName, inviteLink, inviterEmail }: ProjectInviteTemplate) {
    return `
${inviterEmail} has invited you to collaborate on the project "${projectName}".

To accept the invitation, open this link:
${inviteLink}

If you did not expect this email, you can safely ignore it.
`;
  }

  private buildHtml({ projectName, inviteLink, inviterEmail }: ProjectInviteTemplate) {
    return `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="font-weight: 600; font-size: 20px;">You've been invited!</h2>

      <p style="font-size: 15px;">
        <strong>${inviterEmail}</strong> has invited you to collaborate on the project
        <strong>${projectName}</strong>.
      </p>

      <a href="${inviteLink}"
         style="display: inline-block; margin: 20px 0; padding: 12px 22px; background-color: #4f46e5; 
                color: #fff; text-decoration: none; border-radius: 6px; font-size: 15px;">
        Accept Invitation
      </a>

      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 14px; color: #555;">
        ${inviteLink}
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 12px; color: #999;">
        This email was sent automatically. If you did not expect it, you can ignore it.
      </p>
  </div>
`;
  }

  private buildReleaseSubject(template: ReleaseUpdateTemplate) {
    const action = template.isNewRelease ? 'created' : 'updated';
    return `${template.projectName}: ${template.environment} release ${action}`;
  }

  private buildReleasePlainText(template: ReleaseUpdateTemplate) {
    const action = template.isNewRelease ? 'created' : 'updated';
    const lines = [
      `${template.actorName} (${template.actorEmail}) ${action} a release for ${template.projectName}.`,
      '',
      `Environment: ${template.environment}`,
      `Version: ${template.version}`,
      `Branch: ${template.branch}`,
      `Build: ${template.build}`,
      `Date: ${template.date}`,
    ];

    if (template.commitMessage) {
      lines.push(`Commit message: ${template.commitMessage}`);
    }

    lines.push('', 'You are receiving this because you collaborate on this project.');
    return lines.join('\n');
  }

  private buildReleaseHtml(template: ReleaseUpdateTemplate) {
    const action = template.isNewRelease ? 'created' : 'updated';
    const commitMessageSection = template.commitMessage
      ? `<p style="font-size: 14px; color: #444;"><strong>Commit message:</strong> ${template.commitMessage}</p>`
      : '';

    return `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="font-weight: 600; font-size: 20px; margin-bottom: 10px;">
        ${template.projectName} &mdash; ${template.environment} release ${action}
      </h2>
      <p style="font-size: 15px; color: #444;">
        ${template.actorName} (${template.actorEmail}) ${action} a release for this project.
      </p>
      <div style="font-size: 14px; line-height: 1.6; color: #333; background: #f5f5ff; padding: 16px; border-radius: 8px;">
        <p style="margin: 0;"><strong>Version:</strong> ${template.version}</p>
        <p style="margin: 0;"><strong>Branch:</strong> ${template.branch}</p>
        <p style="margin: 0;"><strong>Build:</strong> ${template.build}</p>
        <p style="margin: 0;"><strong>Date:</strong> ${template.date}</p>
      </div>
      ${commitMessageSection}
      <p style="font-size: 12px; color: #777; margin-top: 20px;">
        You are receiving this because you collaborate on ${template.projectName}.
      </p>
  </div>
`;
  }
}

import { Languages } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { isZhReady } from '@/lib/i18n/zh-rollout';
import type { AppLocale } from '@/lib/i18n/config';

type ZhTranslationNoticeProps = {
  locale: AppLocale;
  toolId: string;
};

const TELEGRAM_SUGGESTION_URL = 'https://t.me/Lucasqc04';

export function ZhTranslationNotice({ locale, toolId }: Readonly<ZhTranslationNoticeProps>) {
  if (locale !== 'zh' || isZhReady(toolId)) {
    return null;
  }

  return (
    <Card className="mb-8 flex items-start gap-3 border-amber-200 bg-amber-50">
      <Languages className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
      <p className="text-sm leading-6 text-amber-900">
        该工具的内容尚未完全翻译成中文,目前展示的是英文版本。我们正在逐步翻译所有工具,如果你希望我们优先翻译某个工具或有其他建议,欢迎点击右下角的
        {' '}
        <a
          href={TELEGRAM_SUGGESTION_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium underline underline-offset-2"
        >
          建议工具
        </a>
        {' '}
        按钮告诉我们。
      </p>
    </Card>
  );
}

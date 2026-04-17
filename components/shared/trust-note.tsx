import { Card } from '@/components/ui/card';

type TrustNoteProps = {
  title: string;
  text: string;
};

export function TrustNote({ title, text }: TrustNoteProps) {
  return (
    <Card className="bg-slate-50">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-700">{text}</p>
    </Card>
  );
}

import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';

type Props = {
  account: string;
  accountId: string;
}

export const AccountColumn = ({ account, accountId }: Props) => {
  const { onOpen: onOpenAccount } = useOpenAccount();
  const onClick = () => {
    console.log('AccountID: ', accountId);
    onOpenAccount(accountId);
  };
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center hover:underline"
    >
      {account}
    </div>
  );
};
import { Layout as BaseLayout } from "@components/layout";

export default async function Layout({ children }: React.PropsWithChildren) {
  return <BaseLayout>{children}</BaseLayout>;
}
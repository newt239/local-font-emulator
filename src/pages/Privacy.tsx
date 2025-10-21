import { Container, Text, Title, Anchor, List } from "@mantine/core";

const PrivacyPage: React.FC = () => {
  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        プライバシーポリシー
      </Title>

      <Title order={2} size="h3" mt="xl" mb="md">
        アクセス解析ツールについて
      </Title>
      <Text mb="md">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。
        このGoogleアナリティクスはデータの収集のためにCookieを使用しています。
        このデータは匿名で収集されており、個人を特定するものではありません。
      </Text>
      <Text mb="md">
        この機能はCookieを無効にすることで収集を拒否することができますので、
        お使いのブラウザの設定をご確認ください。
      </Text>
      <Text mb="md">
        Googleアナリティクスの利用規約については、
        <Anchor href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">
          こちら
        </Anchor>
        をご覧ください。
      </Text>
      <Text mb="md">
        Googleのプライバシーポリシーについては、
        <Anchor href="https://policies.google.com/privacy?hl=ja" target="_blank">
          こちら
        </Anchor>
        をご覧ください。
      </Text>

      <Title order={2} size="h3" mt="xl" mb="md">
        収集する情報
      </Title>
      <Text mb="md">
        当サイトでは、以下の情報を収集します：
      </Text>
      <List mb="md">
        <List.Item>ページビューやサイト内での行動に関する情報</List.Item>
        <List.Item>デバイスやブラウザに関する情報</List.Item>
        <List.Item>アクセス元に関する情報</List.Item>
      </List>

      <Title order={2} size="h3" mt="xl" mb="md">
        免責事項
      </Title>
      <Text mb="md">
        当サイトのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、
        正確性や安全性を保証するものではありません。当サイトに掲載された内容によって生じた損害等の
        一切の責任を負いかねますのでご了承ください。
      </Text>

      <Title order={2} size="h3" mt="xl" mb="md">
        プライバシーポリシーの変更
      </Title>
      <Text mb="md">
        当サイトは、個人情報に関して適用される日本の法令を遵守するとともに、
        本プライバシーポリシーの内容を適宜見直しその改善に努めます。
        修正された最新のプライバシーポリシーは常に本ページにて開示されます。
      </Text>
    </Container>
  );
};

export default PrivacyPage;

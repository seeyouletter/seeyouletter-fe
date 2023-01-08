import BaseLayout from 'layouts/BaseLayout';

import React from 'react';

import { useTheme } from '@emotion/react';

import { DefaultButton } from '@ui/button';
import { MyTemplateCard } from '@ui/card';
import { DefaultHStack, DefaultVStack } from '@ui/stack';
import { HeaderText } from '@ui/text';

import { TemplateCardList } from '@templates/index';

export default function My() {
  const theme = useTheme();

  return (
    <section>
      <DefaultVStack
        width="100%"
        height="360px"
        background={theme.color.dark}
        spacing={8}
        justifyContent="center"
        paddingLeft={8}
        paddingRight={8}
      >
        <DefaultHStack justifyContent="space-between">
          <HeaderText as="h4" color="white">
            작업 중인 템플릿 목록
          </HeaderText>
          <DefaultButton>전체 보기</DefaultButton>
        </DefaultHStack>

        <DefaultHStack justifyContent="space-between">
          <MyTemplateCard
            title="템플릿1"
            imageAlt="템플릿1"
            imageSrc="/naver-login.svg"
            createAt="2022.01.08"
            lastUpdateAt="10분 전"
          />
          <MyTemplateCard
            title="템플릿1"
            imageAlt="템플릿1"
            imageSrc="/kakao-login.svg"
            createAt="2022.01.08"
            lastUpdateAt="10분 전"
          />
          <MyTemplateCard
            title="템플릿1"
            imageAlt="템플릿1"
            imageSrc="/logo.svg"
            createAt="2022.01.08"
            lastUpdateAt="10분 전"
          />
          <MyTemplateCard
            title="템플릿1"
            imageAlt="템플릿1"
            imageSrc="/carousel-example.webp"
            createAt="2022.01.08"
            lastUpdateAt="10분 전"
          />
        </DefaultHStack>
      </DefaultVStack>

      <DefaultVStack marginTop={16}>
        <TemplateCardList title="찜한 템플릿" button={<DefaultButton>전체 보기</DefaultButton>} />
      </DefaultVStack>
    </section>
  );
}

My.getLayout = function getLayout(page: React.ReactElement) {
  return <BaseLayout isMainPadding={false}>{page}</BaseLayout>;
};
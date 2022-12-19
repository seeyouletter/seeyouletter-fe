import Image from 'next/image';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Menu, MenuItem, MenuList } from '@chakra-ui/react';

import { DefaultLink, FullLogoLink } from '../../../../Link';
import { LinkInterface } from '../../../../Link/types';
import { MenuIconButton } from '../../../../Menu';
import { BaseHeaderContainer, BaseHeaderInner, StyledPageLinks } from './styles';

interface PageLinksPropsInterface {
  pageLinks: LinkInterface[];
}
interface BaseHeaderPropsInterface extends PageLinksPropsInterface {
  logoLink: LinkInterface;
  user: {
    profileUrl: string;
  };
}

export const BasePageLinks = ({ pageLinks }: PageLinksPropsInterface) => {
  return (
    <StyledPageLinks>
      {pageLinks.map((pageLink) => (
        <DefaultLink key={pageLink.href} href={pageLink.href} color="text">
          {pageLink.children}
        </DefaultLink>
      ))}
    </StyledPageLinks>
  );
};

const UserProfile = styled(Image)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BaseHeader = ({ logoLink, pageLinks, user }: BaseHeaderPropsInterface) => {
  return (
    <BaseHeaderContainer className="layout__header header">
      <BaseHeaderInner className="header__inner">
        <FullLogoLink href={logoLink.href} />
        <BasePageLinks pageLinks={pageLinks}></BasePageLinks>

        <Menu>
          <MenuIconButton>
            <UserProfile
              css={css`
                border-radius: 50%;
              `}
              loader={() => user.profileUrl}
              src={user.profileUrl}
              alt="user"
              width={32}
              height={32}
            />
          </MenuIconButton>

          <MenuList>
            <MenuItem>내 정보 보기</MenuItem>
            <MenuItem>로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </BaseHeaderInner>
    </BaseHeaderContainer>
  );
};

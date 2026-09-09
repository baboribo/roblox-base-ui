"use client";

import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export function CardExample() {
  return (
    <Card>
      <CardHeader>
        <Badge>프로젝트</Badge>
        <CardTitle>함께 만드는 새로운 세계</CardTitle>
        <CardDescription>
          친구와 아이디어를 현실로 만들어보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        컴포넌트를 조합해 프로젝트에 맞는 카드를 만들 수 있습니다.
      </CardContent>
      <CardFooter>
        <Button
          render={<a href="#install" />}
          nativeButton={false}
          variant="emphasis"
        >
          사용 방법
        </Button>
        <Button render={<a href="#foundations" />} nativeButton={false}>
          토큰 보기
        </Button>
      </CardFooter>
    </Card>
  );
}

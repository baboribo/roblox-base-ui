"use client";
import { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Badge } from "../src/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../src/components/ui/card";
import { Field } from "../src/components/ui/field";
import { Input } from "../src/components/ui/input";
import { Select } from "../src/components/ui/select";
import { Stack, Inline, Grid, ControlGroup } from "../src/components/ui/layout";
import { Icon } from "../src/components/ui/icon";

export function ResponsiveLayoutExample() {
  const [width, setWidth] = useState(640);
  const [name, setName] = useState("홈 화면 개편");
  const [invite, setInvite] = useState("");
  const [members, setMembers] = useState(["design@example.com"]);
  const [saved, setSaved] = useState("");
  return (
    <Stack>
      <Inline aria-label="예제 영역 너비">
        {[200, 320, 640].map((size) => (
          <Button
            key={size}
            size="sm"
            variant={width === size ? "standard" : "utility"}
            aria-pressed={width === size}
            onClick={() => setWidth(size)}
          >
            {size}px
          </Button>
        ))}
      </Inline>
      <Card style={{ width: "100%", maxWidth: width }}>
        <CardHeader>
          <Badge>초안</Badge>
          <CardTitle>프로젝트 설정</CardTitle>
          <CardDescription>
            이름과 공개 범위를 설정하고 구성원을 추가합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stack gap={24}>
            <Grid minItemWidth="14rem">
              <Field.Root>
                <Field.Label>프로젝트 이름</Field.Label>
                <Input value={name} onValueChange={setName} />
              </Field.Root>
              <Select
                label="공개 범위"
                defaultValue="team"
                options={[
                  { value: "team", label: "팀 구성원" },
                  { value: "private", label: "나만 보기" },
                ]}
              />
            </Grid>
            <Field.Root>
              <Field.Label>구성원 이메일</Field.Label>
              <ControlGroup>
                <Input
                  leading={<Icon name="icon-regular-person" size={20} />}
                  type="email"
                  placeholder="name@example.com"
                  value={invite}
                  onValueChange={setInvite}
                />
                <Button
                  variant="standard"
                  disabled={!invite.includes("@")}
                  onClick={() => {
                    setMembers([...new Set([...members, invite])]);
                    setInvite("");
                  }}
                >
                  추가
                </Button>
              </ControlGroup>
              <Field.Description>
                프로젝트에 참여할 구성원을 목록에 추가합니다.
              </Field.Description>
            </Field.Root>
            <Inline aria-label="구성원">
              {members.map((member) => (
                <Badge key={member}>{member}</Badge>
              ))}
            </Inline>
          </Stack>
        </CardContent>
        <CardFooter divider>
          <Button onClick={() => setSaved(`${name} 설정을 저장했습니다.`)}>
            저장
          </Button>
        </CardFooter>
      </Card>
      {saved && <p role="status">{saved}</p>}
    </Stack>
  );
}

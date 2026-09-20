import { Stack, Inline, Grid, ControlGroup } from "../src/components/ui/layout";
import { Card, CardContent } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Badge } from "../src/components/ui/badge";
export function LayoutExample() {
  return (
    <Stack>
      <ControlGroup>
        <Input aria-label="프로젝트 검색" placeholder="프로젝트 이름" />
        <Button>검색</Button>
      </ControlGroup>
      <Grid minItemWidth="14rem">
        {["홈 화면", "에셋 라이브러리", "팀 설정"].map((title) => (
          <Card key={title}>
            <CardContent>
              <Stack gap={12}>
                <Badge>프로젝트</Badge>
                <strong>{title}</strong>
                <Inline>
                  <Button size="sm" variant="standard">
                    열기
                  </Button>
                  <Button size="sm" variant="utility">
                    더 보기
                  </Button>
                </Inline>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}

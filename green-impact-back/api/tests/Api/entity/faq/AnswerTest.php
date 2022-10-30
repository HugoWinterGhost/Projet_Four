<?php
namespace App\Tests\Api\entity\faq;

use App\Entity\FAQ\Question;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use App\Tests\ApiAuthenticationTest;
use App\Entity\FAQ\Answer;

/**
 * Class AnswerTest
 * @package Answer
 */
class AnswerTest extends ApiAuthenticationTest
{
    use RefreshDatabaseTrait;

    /**
     * Test Get Collection of Answer
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testGetCollection(): void
    {
        $response = $this->createClientWithCredentials()->request('GET', '/answers');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Answer',
            '@id' => '/answers',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 100,
        ]);

        $this->assertCount(30, $response->toArray()['hydra:member']);

        $this->assertMatchesResourceCollectionJsonSchema(Answer::class);
    }

    /**
     * Test create Answer
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateAnswer(): void
    {
        $questionIri = $this->findIriBy(Question::class, ['name' => 'question_1']);

        $this->createClientWithCredentials()->request('POST', '/answers', [
            'json' => [
                "name" => "test",
                "question" => $questionIri,
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Answer',
            '@type' => 'Answer',
            "name" => "test",
            "question" => $questionIri,
        ]);
        $this->assertMatchesResourceItemJsonSchema(Answer::class);
    }

    /**
     * Test creating an invalid answer
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateInvalidAnswer(): void
    {
        $this->createClientWithCredentials()->request('POST', '/answers', [
            'json' => []
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.
question: This value should not be null.',
        ]);
    }

    /**
     * Test if update a answer
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testUpdateAnswer(): void
    {
        $iri = $this->findIriBy(Answer::class, ['name' => 'answer_1']);

        $this->createClientWithCredentials()->request('PATCH', $iri, [
            'json' => [ 'name' => 'test'],
            "headers" => [
                "Content-Type" => "application/merge-patch+json"
            ]
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertJsonContains([
            '@id' => $iri,
            'name' => 'test',
        ]);
    }

    /**
     * Test if delete business.
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testDeleteAnswer(): void
    {
        $iri = $this->findIriBy(Answer::class, ['name' => 'answer_1']);

        $this->createClientWithCredentials()->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            $this->getContainer()->get('doctrine')->getRepository(Answer::class)->findOneBy(['name' => 'answer_1'])
        );
    }
}

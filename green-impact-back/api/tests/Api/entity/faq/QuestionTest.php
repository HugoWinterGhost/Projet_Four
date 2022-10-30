<?php
namespace App\Tests\Api\entity\faq;

use App\Entity\FAQ\Question;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use App\Tests\ApiAuthenticationTest;

/**
 * Class QuestionTest
 * @package Question
 */
class QuestionTest extends ApiAuthenticationTest
{
    use RefreshDatabaseTrait;

    /**
     * Test Get Collection of Question
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
        $response = $this->createClientWithCredentials()->request('GET', '/questions');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Question',
            '@id' => '/questions',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 10,
        ]);

        $this->assertCount(10, $response->toArray()['hydra:member']);

        $this->assertMatchesResourceCollectionJsonSchema(Question::class);
    }

    /**
     * Test create Question
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateQuestion(): void
    {

        $this->createClientWithCredentials()->request('POST', '/questions', [
            'json' => [
                "name" => "test",
            ]
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertJsonContains([
            '@context' => '/contexts/Question',
            '@type' => 'Question',
            "name" => "test",
        ]);
        $this->assertMatchesResourceItemJsonSchema(Question::class);
    }

    /**
     * Test creating an invalid question
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testCreateInvalidQuestion(): void
    {
        $this->createClientWithCredentials()->request('POST', '/questions', [
            'json' => []
        ]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    /**
     * Test if update a question
     *
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\DecodingExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     *
     * @return void
     */
    public function testUpdateQuestion(): void
    {
        $iri = $this->findIriBy(Question::class, ['name' => 'question_1']);

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
    public function testDeleteQuestion(): void
    {
        $iri = $this->findIriBy(Question::class, ['name' => 'question_1']);

        $this->createClientWithCredentials()->request('DELETE', $iri);

        $this->assertResponseStatusCodeSame(204);
        $this->assertNull(
            $this->getContainer()->get('doctrine')->getRepository(Question::class)->findOneBy(['name' => 'question_1'])
        );
    }
}
